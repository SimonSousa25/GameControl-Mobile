import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  type PointerEvent as ReactNativePointerEvent,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";

interface GameCarouselProps {
  title: string;
  games?: GameDTO[];
  onGamePress?: (gameId: string) => void;
  onViewAllPress?: () => void;
  fetchRecent?: boolean;
}

const MAX_GAMES = 16;
const VISIBLE_GAMES = 4;
const GAME_CARD_WIDTH = 84;
const GAME_CARD_GAP = 12;
const GAME_CARD_STEP = GAME_CARD_WIDTH + GAME_CARD_GAP;
const AUTO_SCROLL_START_DELAY = 1000;
const AUTO_SCROLL_END_DELAY = 200;
const AUTO_SCROLL_MS_PER_PIXEL = 20;
const AUTO_SCROLL_RETURN_DURATION = 1800;
const INTERACTION_RESUME_DELAY = 1200;

export default function GameCarousel({
  title,
  games: initialGames,
  onGamePress,
  fetchRecent = false,
}: GameCarouselProps) {
  const [games, setGames] = useState<GameDTO[]>(initialGames || []);
  const [loading, setLoading] = useState(!initialGames && fetchRecent);
  const carouselRef = useAnimatedRef<ScrollView>();
  const animatedOffset = useSharedValue(0);
  const scrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const dragStartX = useRef(0);
  const pointerDownX = useRef(0);
  const pointerDownY = useRef(0);
  const gameCount = useRef(0);
  const autoCycleStarted = useRef(false);
  const isUserInteracting = useRef(false);
  const isWebPointerActive = useRef(false);
  const didWebDrag = useRef(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const webDragResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  gameCount.current = Math.min(games.length, MAX_GAMES);

  useAnimatedReaction(
    () => animatedOffset.value,
    (offset) => {
      scrollTo(carouselRef, offset, 0, false);
    },
  );

  const getFinalScrollOffset = () =>
    Math.max(0, (gameCount.current - VISIBLE_GAMES) * GAME_CARD_STEP);

  function startReturnAnimation() {
    animatedOffset.value = withDelay(
      AUTO_SCROLL_END_DELAY,
      withTiming(
        0,
        {
          duration: AUTO_SCROLL_RETURN_DURATION,
          easing: Easing.inOut(Easing.cubic),
        },
        (returned) => {
          if (returned) {
            runOnJS(startAutoScrollCycle)(0);
          }
        },
      ),
    );
  }

  function startAutoScrollCycle(startOffset = 0) {
    const finalOffset = getFinalScrollOffset();
    if (finalOffset <= 0 || isUserInteracting.current) return;

    const normalizedOffset = Math.min(Math.max(0, startOffset), finalOffset);
    const remainingDistance = finalOffset - normalizedOffset;

    // Se já estamos no fim, não cria uma falsa animação do limite para ele mesmo.
    if (remainingDistance <= 1) {
      animatedOffset.value = normalizedOffset;
      startReturnAnimation();
      return;
    }

    const forwardDuration = Math.max(
      1200,
      remainingDistance * AUTO_SCROLL_MS_PER_PIXEL,
    );

    animatedOffset.value = normalizedOffset;
    animatedOffset.value = withDelay(
      AUTO_SCROLL_START_DELAY,
      withTiming(
        finalOffset,
        {
          duration: forwardDuration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(startReturnAnimation)();
          }
        },
      ),
    );
  }

  const startAutoScrollWhenReady = () => {
    if (autoCycleStarted.current || getFinalScrollOffset() <= 0) return;

    autoCycleStarted.current = true;
    startAutoScrollCycle(scrollOffset.current);
  };

  const pauseAutoScroll = () => {
    isUserInteracting.current = true;
    autoCycleStarted.current = false;
    cancelAnimation(animatedOffset);
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = null;
    }
  };

  const resumeAutoScroll = () => {
    if (!isUserInteracting.current) return;

    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
    }

    interactionTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
      interactionTimer.current = null;
      autoCycleStarted.current = true;
      startAutoScrollCycle(scrollOffset.current);
    }, INTERACTION_RESUME_DELAY);
  };

  const handleMomentumScrollBegin = () => {
    if (!isUserInteracting.current || !interactionTimer.current) return;

    clearTimeout(interactionTimer.current);
    interactionTimer.current = null;
  };

  const handleMomentumScrollEnd = () => {
    if (isUserInteracting.current) {
      resumeAutoScroll();
    }
  };

  const handleWebPointerDown = (event: ReactNativePointerEvent) => {
    if (Platform.OS !== "web") return;

    const { button, clientX, clientY, pointerType } = event.nativeEvent;
    if (button !== 0 || pointerType !== "mouse") return;

    if (webDragResetTimer.current) {
      clearTimeout(webDragResetTimer.current);
      webDragResetTimer.current = null;
    }

    isWebPointerActive.current = true;
    didWebDrag.current = false;
    pointerDownX.current = clientX;
    pointerDownY.current = clientY;
  };

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const handleWebPointerMove = (event: globalThis.PointerEvent) => {
      if (!isWebPointerActive.current || event.pointerType !== "mouse") return;

      const deltaX = event.clientX - pointerDownX.current;
      const deltaY = event.clientY - pointerDownY.current;

      if (!didWebDrag.current) {
        if (Math.abs(deltaX) <= 5 && Math.abs(deltaY) <= 5) return;

        if (Math.abs(deltaY) >= Math.abs(deltaX)) {
          isWebPointerActive.current = false;
          return;
        }

        didWebDrag.current = true;
        pauseAutoScroll();
        dragStartOffset.current = scrollOffset.current;
        dragStartX.current = event.clientX;
      }

      event.preventDefault();
      const movement = event.clientX - dragStartX.current;
      const nextOffset = Math.min(
        getFinalScrollOffset(),
        Math.max(0, dragStartOffset.current - movement),
      );

      scrollOffset.current = nextOffset;
      carouselRef.current?.scrollTo({ x: nextOffset, animated: false });
    };

    const finishWebPointerInteraction = () => {
      if (!isWebPointerActive.current) return;

      isWebPointerActive.current = false;
      if (didWebDrag.current) {
        resumeAutoScroll();

        // O click é disparado logo após o pointerup; mantém a trava até ele passar.
        webDragResetTimer.current = setTimeout(() => {
          didWebDrag.current = false;
          webDragResetTimer.current = null;
        }, 0);
      }
    };

    window.addEventListener("pointermove", handleWebPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", finishWebPointerInteraction);
    window.addEventListener("pointercancel", finishWebPointerInteraction);

    return () => {
      window.removeEventListener("pointermove", handleWebPointerMove);
      window.removeEventListener("pointerup", finishWebPointerInteraction);
      window.removeEventListener("pointercancel", finishWebPointerInteraction);
    };
  }, []);

  useEffect(() => {
    if (fetchRecent && !initialGames) {
      loadGames();
    }
  }, [fetchRecent, initialGames]);

  useEffect(
    () => () => {
      cancelAnimation(animatedOffset);
      if (interactionTimer.current) {
        clearTimeout(interactionTimer.current);
      }
      if (webDragResetTimer.current) {
        clearTimeout(webDragResetTimer.current);
      }
    },
    [],
  );

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarJogosEmDestaque(MAX_GAMES);
      setGames(data.slice(0, MAX_GAMES));
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={styles.container}
        lightColor="transparent"
        darkColor="transparent"
      >
        <View
          style={styles.header}
          lightColor="transparent"
          darkColor="transparent"
        >
          <Text style={styles.title}>{title}</Text>
        </View>
        <View
          style={styles.loadingContainer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.container}
      lightColor="transparent"
      darkColor="transparent"
    >
      <View
        style={styles.header}
        lightColor="transparent"
        darkColor="transparent"
      >
        <LinearGradient
          colors={["#0559AB", "#F22E8F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Animated.ScrollView
        ref={carouselRef}
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={pauseAutoScroll}
        onScrollEndDrag={resumeAutoScroll}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={(event) => {
          scrollOffset.current = event.nativeEvent.contentOffset.x;
        }}
        onLayout={startAutoScrollWhenReady}
        onContentSizeChange={startAutoScrollWhenReady}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContent}
        onPointerDown={
          Platform.OS === "web" ? handleWebPointerDown : undefined
        }
      >
        {games.slice(0, MAX_GAMES).map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => {
              if (Platform.OS === "web" && didWebDrag.current) return;
              onGamePress?.(game.id);
            }}
            activeOpacity={0.16}
          >
            <View
              style={styles.gameCardContent}
              lightColor="transparent"
              darkColor="transparent"
              pointerEvents="none"
            >
              <Image
                source={{ uri: game.coverImageUrl }}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <Text style={styles.gameTitle} numberOfLines={2}>
                {game.nome}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

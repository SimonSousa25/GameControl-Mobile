import { Text, View } from "@/components/Themed";
import type { GameDTO } from "@/services/gameService";
import { useFeaturedGames } from "@/src/queries/gameQueries";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  type PointerEvent as ReactNativePointerEvent,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
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
const AUTO_SCROLL_MIN_DURATION = 1200;
const AUTO_SCROLL_RETURN_DURATION = 1800;
const INTERACTION_RESUME_DELAY = 1200;
const WEB_DRAG_THRESHOLD = 5;

/** Anima do offset `from` até `to`, após o delay inicial. */
const createForwardAnimation = (from: number, to: number) =>
  withDelay(
    AUTO_SCROLL_START_DELAY,
    withTiming(to, {
      duration: Math.max(
        AUTO_SCROLL_MIN_DURATION,
        (to - from) * AUTO_SCROLL_MS_PER_PIXEL,
      ),
      easing: Easing.linear,
    }),
  );

/** Anima de volta ao início, após uma pequena pausa no fim. */
const createReturnAnimation = () =>
  withDelay(
    AUTO_SCROLL_END_DELAY,
    withTiming(0, {
      duration: AUTO_SCROLL_RETURN_DURATION,
      easing: Easing.inOut(Easing.cubic),
    }),
  );

/**
 * Container: cuida apenas de buscar/decidir o que exibir.
 *
 * Toda a lógica de animação vive em `GameCarouselList`, que só é montado
 * quando existem jogos. Assim o `Animated.ScrollView` (e a ref usada pelo
 * `scrollTo` do Reanimated) sempre existe enquanto os hooks de animação
 * estão ativos.
 */
export default function GameCarousel({
  title,
  games: initialGames,
  onGamePress,
  fetchRecent = false,
}: GameCarouselProps) {
  // Busca (com cache) só quando a tela pede e não recebeu os jogos prontos.
  const shouldFetch = fetchRecent && !initialGames;
  const { data: fetchedGames, isPending } = useFeaturedGames(
    MAX_GAMES,
    shouldFetch,
  );
  const loading = shouldFetch && isPending;

  const games = (initialGames ?? fetchedGames ?? []).slice(0, MAX_GAMES);

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

  return <GameCarouselList title={title} games={games} onGamePress={onGamePress} />;
}

interface GameCarouselListProps {
  title: string;
  games: GameDTO[];
  onGamePress?: (gameId: string) => void;
}

function GameCarouselList({ title, games, onGamePress }: GameCarouselListProps) {
  const carouselRef = useAnimatedRef<ScrollView>();
  const animatedOffset = useSharedValue(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const scrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const dragStartX = useRef(0);
  const pointerDownX = useRef(0);
  const pointerDownY = useRef(0);
  const isUserInteracting = useRef(false);
  const isWebPointerActive = useRef(false);
  const didWebDrag = useRef(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const webDragResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalOffset = Math.max(
    0,
    (games.length - VISIBLE_GAMES) * GAME_CARD_STEP,
  );

  // Aplica o offset animado ao ScrollView.
  // - previous === null: primeira execução, só reflete o valor inicial (0).
  // - carouselRef(): na UI thread devolve o shadow node da ref. A ref é enviada
  //   do JS para a UI de forma assíncrona, então nos primeiros frames ela ainda
  //   pode ser null. Nesse caso pulamos o frame (o próximo tenta de novo) em vez
  //   de chamar scrollTo e gerar o warning do Reanimated.
  useAnimatedReaction(
    () => animatedOffset.value,
    (offset, previous) => {
      if (previous === null || !carouselRef()) return;
      scrollTo(carouselRef, offset, 0, false);
    },
  );

  /**
   * Ciclo infinito: vai até o fim, volta ao início e repete.
   * Tudo é descrito com withSequence/withRepeat, então não há callbacks
   * nem `runOnJS` recursivo (nada que seja recriado a cada render).
   */
  const startAutoScroll = useCallback(
    (startOffset: number) => {
      if (finalOffset <= 0) return;

      const from = Math.min(Math.max(0, startOffset), finalOffset);
      const loop = withRepeat(
        withSequence(
          createForwardAnimation(0, finalOffset),
          createReturnAnimation(),
        ),
        -1,
        false,
      );

      animatedOffset.value = from;

      // Se já estamos no fim, pula direto para o retorno.
      animatedOffset.value =
        finalOffset - from > 1
          ? withSequence(
              createForwardAnimation(from, finalOffset),
              createReturnAnimation(),
              loop,
            )
          : withSequence(createReturnAnimation(), loop);
    },
    [animatedOffset, finalOffset],
  );

  const clearInteractionTimer = useCallback(() => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = null;
    }
  }, []);

  const pauseAutoScroll = useCallback(() => {
    isUserInteracting.current = true;
    cancelAnimation(animatedOffset);
    clearInteractionTimer();
  }, [animatedOffset, clearInteractionTimer]);

  const resumeAutoScroll = useCallback(() => {
    if (!isUserInteracting.current) return;

    clearInteractionTimer();
    interactionTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
      interactionTimer.current = null;
      startAutoScroll(scrollOffset.current);
    }, INTERACTION_RESUME_DELAY);
  }, [clearInteractionTimer, startAutoScroll]);

  // Só avisa que está pronto quando o ScrollView já foi montado e medido.
  const handleLayout = useCallback(() => setIsLayoutReady(true), []);

  // Inicia (ou reinicia, se a quantidade de jogos mudar) o auto-scroll.
  useEffect(() => {
    if (!isLayoutReady || finalOffset <= 0) return;

    if (!isUserInteracting.current) {
      startAutoScroll(scrollOffset.current);
    }

    return () => cancelAnimation(animatedOffset);
  }, [animatedOffset, finalOffset, isLayoutReady, startAutoScroll]);

  // Limpa timers pendentes ao desmontar.
  useEffect(
    () => () => {
      clearInteractionTimer();
      if (webDragResetTimer.current) {
        clearTimeout(webDragResetTimer.current);
      }
    },
    [clearInteractionTimer],
  );

  const handleMomentumScrollBegin = () => {
    // Enquanto há inércia, não retoma o auto-scroll.
    if (isUserInteracting.current) clearInteractionTimer();
  };

  const handleMomentumScrollEnd = () => {
    resumeAutoScroll();
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

  // Arrastar com o mouse na web.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const handleWebPointerMove = (event: globalThis.PointerEvent) => {
      if (!isWebPointerActive.current || event.pointerType !== "mouse") return;

      const deltaX = event.clientX - pointerDownX.current;
      const deltaY = event.clientY - pointerDownY.current;

      if (!didWebDrag.current) {
        if (
          Math.abs(deltaX) <= WEB_DRAG_THRESHOLD &&
          Math.abs(deltaY) <= WEB_DRAG_THRESHOLD
        ) {
          return;
        }

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
        finalOffset,
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
  }, [carouselRef, finalOffset, pauseAutoScroll, resumeAutoScroll]);

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
        onLayout={handleLayout}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContent}
        onPointerDown={
          Platform.OS === "web" ? handleWebPointerDown : undefined
        }
      >
        {games.map((game) => (
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
                contentFit="cover"
                transition={150}
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
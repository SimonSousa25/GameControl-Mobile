import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

interface GameCarouselProps {
  title: string;
  games?: GameDTO[];
  onGamePress?: (gameId: string) => void;
  onViewAllPress?: () => void;
  fetchRecent?: boolean;
}

export default function GameCarousel({
  title,
  games: initialGames,
  onGamePress,
  onViewAllPress,
  fetchRecent = false,
}: GameCarouselProps) {
  const [games, setGames] = useState<GameDTO[]>(initialGames || []);
  const [loading, setLoading] = useState(!initialGames && fetchRecent);
  const carouselRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const dragStartX = useRef(0);

  // No navegador, o ScrollView não converte o arraste do mouse em rolagem.
  const webDragResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 5 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (_, gesture) => {
        dragStartOffset.current = scrollOffset.current;
        dragStartX.current = gesture.dx;
      },
      onPanResponderMove: (_, gesture) => {
        const movement = gesture.dx - dragStartX.current;
        carouselRef.current?.scrollTo({
          x: Math.max(0, dragStartOffset.current - movement),
          animated: false,
        });
      },
    }),
  ).current;

  useEffect(() => {
    if (fetchRecent && !initialGames) {
      loadGames();
    }
  }, [fetchRecent, initialGames]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarJogosEmDestaque(16);
      setGames(data.slice(0, 16));
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

      <ScrollView
        ref={carouselRef}
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scrollOffset.current = event.nativeEvent.contentOffset.x;
        }}
        style={styles.carouselContainer}
        {...(Platform.OS === "web" ? webDragResponder.panHandlers : {})}
      >
        {games.slice(0, 16).map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => onGamePress?.(game.id)}
            activeOpacity={0.16}
          >
            <Image
              source={{ uri: game.coverImageUrl }}
              style={styles.gameImage}
              resizeMode="cover"
            />
            <Text style={styles.gameTitle} numberOfLines={2}>
              {game.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

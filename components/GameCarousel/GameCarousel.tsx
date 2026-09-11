import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
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

  useEffect(() => {
    if (fetchRecent && !initialGames) {
      loadGames();
    }
  }, [fetchRecent, initialGames]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarJogosRecentes();
      setGames(data.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container} lightColor="transparent" darkColor="transparent">
        <View style={styles.header} lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.loadingContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} lightColor="transparent" darkColor="transparent">
      <View style={styles.header} lightColor="transparent" darkColor="transparent">
        <LinearGradient
          colors={["#0559AB", "#F22E8F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAll}>Ver tudo →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => onGamePress?.(game.id)}
            activeOpacity={0.8}
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

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import { styles } from "./styles";

const MAX_CONTENT_WIDTH = 402;

// TODO: Galera, aqui eu acho interessante fazermos uma rota no backend para pegarmos 4 jogos específicos e deixarmos sempre eles mostrando nesse componente de banner principal;

interface HeroBannerProps {
  games?: GameDTO[];
  onGamePress?: (gameId: string) => void;
}

export default function HeroBanner({
  games: initialGames,
  onGamePress,
}: HeroBannerProps) {
  const [games, setGames] = useState<GameDTO[]>(initialGames || []);
  const [loading, setLoading] = useState(!initialGames);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = Math.min(windowWidth, MAX_CONTENT_WIDTH);

  useEffect(() => {
    if (!initialGames) {
      loadGames();
    }
  }, [initialGames]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarJogosRecentes();
      setGames(data.slice(0, 4));
    } catch (error) {
      console.error("Erro ao carregar banner principal:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, games.length - 1));
    setActiveIndex(clampedIndex);
    scrollRef.current?.scrollTo({
      x: clampedIndex * slideWidth,
      animated: true,
    });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      </View>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
        >
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.slide, { width: slideWidth }]}
              activeOpacity={0.95}
              onPress={() => onGamePress?.(game.id)}
            >
              <ImageBackground
                source={{ uri: game.coverImageUrl || game.capa }}
                style={styles.image}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(3, 7, 13, 0.55)",
                    "rgba(3, 7, 13, 0.95)",
                  ]}
                  locations={[0, 0.5, 1]}
                  style={styles.overlay}
                />

                <View
                  style={styles.content}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <View
                    style={styles.badge}
                    lightColor="transparent"
                    darkColor="transparent"
                  >
                    <AntDesign name="star" size={12} color="#FFD700" />
                    <Text style={styles.badgeText}>Bem avaliado</Text>
                  </View>

                  <Text style={styles.gameTitle}>{game.title}</Text>

                  <Text style={styles.description} numberOfLines={4}>
                    {game.description || "Confira este jogo incrível."}
                  </Text>

                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => onGamePress?.(game.id)}
                  >
                    <LinearGradient
                      colors={["#F52E8F", "#A3186A"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaGradient}
                    >
                      <Text style={styles.ctaText}>Conheça o Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {games.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={() => goToSlide(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <Ionicons name="chevron-back" size={18} color="#F5F7FF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => goToSlide(activeIndex + 1)}
              disabled={activeIndex === games.length - 1}
            >
              <Ionicons name="chevron-forward" size={18} color="#F5F7FF" />
            </TouchableOpacity>

            <View
              style={styles.pagination}
              lightColor="transparent"
              darkColor="transparent"
            >
              {games.map((game, index) => (
                <View
                  key={game.id}
                  style={[styles.dot, index === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

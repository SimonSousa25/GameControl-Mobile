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
import type { ImageSourcePropType } from "react-native";

import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import { styles } from "./styles";

const MAX_CONTENT_WIDTH = 402;
const SLIDE_INTERVAL = 7000;
const BANNER_ASPECT_RATIO = 960 / 800;

interface HeroBannerProps {
  games?: GameDTO[];
  onGamePress?: (gameId: string) => void;
  onExplorePress?: () => void;
}

type BannerItem = GameDTO & {
  localImage?: ImageSourcePropType;
  isPresentation?: boolean;
  titleWhite?: string;
  ctaLabel?: string;
};

const localBanner: BannerItem = {
  id: "gamecontrol-banner",
  slug: "gamecontrol-banner",
  title: "MUNDOS GAMER",
  titleWhite: "DESCUBRA NOVOS",
  description:
    "Veja jogos, avaliações, playlists e perfis de outros jogadores.",
  ctaLabel: "Ver Todos os Jogos",
  localImage: require("../../../assets/images/img-arcade-960x800.png"),
  isPresentation: true,
};

const HERO_GAMES = [
  {
    slug: "phasmophobia",
    title: "Phasmophobia",
    description:
      "Investigue locais assombrados com seus amigos. Você tem coragem?",
    image: require("../../../assets/images/img-phasmophobia-960x800.png"),
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    description:
      "Um mundo aberto épico criado por Hidetaka Miyazaki e George R.R. Martin.",
    image: require("../../../assets/images/img-elden-ring-960x800.png"),
  },
  {
    slug: "the-isle",
    title: "The Isle",
    description:
      "Sobreviva em uma ilha selvagem dominada por dinossauros. Você será caçador ou presa?",
    image: require("../../../assets/images/img-the-isle-960x800.png"),
  },
] as const;

const normalizeGameName = (value: string) => value.trim().toLowerCase();

const selectHeroGames = (availableGames: GameDTO[]): BannerItem[] =>
  HERO_GAMES.reduce<BannerItem[]>((selectedGames, heroGame) => {
    const game = availableGames.find(
      (candidate) =>
        normalizeGameName(candidate.slug) === heroGame.slug ||
        normalizeGameName(candidate.title) ===
          normalizeGameName(heroGame.title),
    );

    if (game) {
      selectedGames.push({
        ...game,
        // O texto do banner é curto e não depende da descrição da API.
        description: heroGame.description,
        localImage: heroGame.image,
      });
    }

    return selectedGames;
  }, []);

export default function HeroBanner({
  games: initialGames,
  onGamePress,
  onExplorePress,
}: HeroBannerProps) {
  const [games, setGames] = useState<BannerItem[]>(
    initialGames ? selectHeroGames(initialGames) : [],
  );
  const [loading, setLoading] = useState(!initialGames);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = Math.min(windowWidth, MAX_CONTENT_WIDTH);
  const slideHeight = slideWidth / BANNER_ASPECT_RATIO;

  const gameSlides: BannerItem[] = [localBanner, ...games];

  useEffect(() => {
    if (initialGames) {
      setGames(selectHeroGames(initialGames));
      setLoading(false);
      return;
    }

    loadGames();
  }, [initialGames]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarTodosJogos();
      setGames(selectHeroGames(data));
    } catch (error) {
      console.error("Erro ao carregar banner principal:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    if (gameSlides.length === 0) return;

    // Mantém o carrossel circular, como na versão web.
    const clampedIndex =
      (index + gameSlides.length) % gameSlides.length;
    setActiveIndex(clampedIndex);
    scrollRef.current?.scrollTo({
      x: clampedIndex * slideWidth,
      animated: true,
    });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    const clampedIndex = Math.max(
      0,
      Math.min(index, gameSlides.length - 1),
    );
    setActiveIndex(clampedIndex);
  };

  // Reinicia a contagem sempre que o usuário muda de slide manualmente.
  useEffect(() => {
    if (loading || gameSlides.length <= 1) return;

    const timeoutId = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % gameSlides.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * slideWidth,
        animated: true,
      });
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timeoutId);
  }, [activeIndex, gameSlides.length, loading, slideWidth]);

  const handleBannerPress = (game: BannerItem) => {
    if (game.isPresentation) {
      onExplorePress?.();
      return;
    }

    onGamePress?.(game.id);
  };

  if (loading) {
    return (
      <View
        style={styles.container}
        lightColor="transparent"
        darkColor="transparent"
      >
        <View style={[styles.loadingContainer, { height: slideHeight }]}>
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      lightColor="transparent"
      darkColor="transparent"
    >
      <View style={styles.wrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
        >
          {gameSlides.map((game) => (
            <View
              key={game.id}
              style={[
                styles.slide,
                { width: slideWidth, height: slideHeight },
              ]}
            >
              <View style={styles.cardShadow}>
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.95}
                  onPress={() => handleBannerPress(game)}
                >
                  <ImageBackground
                    source={
                      game.localImage
                        ? game.localImage
                        : { uri: game.coverImageUrl || game.capa }
                    }
                    style={styles.image}
                    imageStyle={styles.backgroundImage}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={
                        game.isPresentation
                          ? [
                              "rgba(75, 8, 45, 0.82)",
                              "rgba(3, 7, 13, 0.62)",
                              "rgba(0, 67, 80, 0.48)",
                            ]
                          : [
                              "rgba(3, 7, 13, 0.88)",
                              "rgba(3, 7, 13, 0.5)",
                              "rgba(3, 7, 13, 0.12)",
                            ]
                      }
                      locations={[0, 0.58, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.overlay}
                    />

                    <LinearGradient
                      colors={["transparent", "rgba(3, 7, 13, 0.7)"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.overlay}
                    />

                    <View
                      style={styles.content}
                      lightColor="transparent"
                      darkColor="transparent"
                    >
                      {!game.isPresentation ? (
                        <View
                          style={styles.badge}
                          lightColor="transparent"
                          darkColor="transparent"
                        >
                          <AntDesign name="star" size={12} color="#FFD700" />
                          <Text style={styles.badgeText}>Bem avaliado</Text>
                        </View>
                      ) : null}

                      {game.titleWhite ? (
                        <>
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.72}
                            numberOfLines={1}
                            style={[
                              styles.gameTitle,
                              styles.gameTitleWhite,
                              styles.gameTitleFirstLine,
                            ]}
                          >
                            {game.titleWhite}
                          </Text>
                          <Text
                            adjustsFontSizeToFit
                            minimumFontScale={0.72}
                            numberOfLines={1}
                            style={styles.gameTitle}
                          >
                            {game.title}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.gameTitle} numberOfLines={2}>
                          {game.title}
                        </Text>
                      )}

                      <Text style={styles.description} numberOfLines={4}>
                        {game.description || "Confira este jogo incrível."}
                      </Text>

                      <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => handleBannerPress(game)}
                      >
                        <LinearGradient
                          colors={["#F52E8F", "#D92A86"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.ctaGradient}
                        >
                          <Text style={styles.ctaText}>
                            {game.ctaLabel || "Conheça o Jogo"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {gameSlides.length > 1 && (
          <>
            <TouchableOpacity
              accessibilityLabel="Slide anterior"
              style={[styles.navButton, styles.prevButton]}
              onPress={() => goToSlide(activeIndex - 1)}
            >
              <Ionicons name="chevron-back" size={18} color="#F5F7FF" />
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityLabel="Próximo slide"
              style={[styles.navButton, styles.nextButton]}
              onPress={() => goToSlide(activeIndex + 1)}
            >
              <Ionicons name="chevron-forward" size={18} color="#F5F7FF" />
            </TouchableOpacity>

            <View
              style={styles.pagination}
              lightColor="transparent"
              darkColor="transparent"
            >
              {gameSlides.map((game, index) => (
                <TouchableOpacity
                  key={game.id}
                  accessibilityLabel={`Ir para o slide ${index + 1}`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => goToSlide(index)}
                  style={[
                    styles.dot,
                    index === activeIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import gameService, { GameDTO } from '@/services/gameService';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface GameOfWeekProps {
  onGamePress?: (gameId: string) => void;
}

interface GameOfWeekData {
  game: GameDTO;
  /** Presentes quando o jogo vem do ranking por reviews. */
  averageRating?: number;
  reviewCount?: number;
}

const MAX_STARS = 5;

/** Estrela cheia, meia ou vazia para a posição `index` (0 a 4) da média. */
function starName(average: number, index: number): 'star' | 'star-half' | 'star-outline' {
  if (average >= index + 1) return 'star';
  if (average >= index + 0.5) return 'star-half';
  return 'star-outline';
}

export default function GameOfWeek({ onGamePress }: GameOfWeekProps) {
  const [data, setData] = useState<GameOfWeekData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      setLoading(true);

      // Prioridade: o jogo mais bem avaliado pelas reviews dos jogadores.
      const topRated = await gameService.buscarMelhorAvaliado().catch(() => null);
      if (topRated?.game) {
        setData({
          game: topRated.game,
          averageRating: topRated.averageRating,
          reviewCount: topRated.reviewCount,
        });
        return;
      }

      // Ainda não há jogo com avaliações suficientes: usa o destaque da semana.
      const featured = await gameService.buscarJogoDaSemana();
      setData(featured ? { game: featured } : null);
    } catch (error) {
      console.error('Erro ao carregar o jogo da semana:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container} lightColor="transparent" darkColor="transparent">
        <View style={styles.header} lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>Jogo da Semana</Text>
        </View>
        <View style={styles.loadingContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const { game, averageRating, reviewCount } = data;
  const hasRating = averageRating !== undefined && reviewCount !== undefined;

  return (
    <View style={styles.container} lightColor="transparent" darkColor="transparent">
      <View style={styles.header} lightColor="transparent" darkColor="transparent">
        <LinearGradient
          colors={['#0559AB', '#F22E8F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>Jogo da Semana</Text>
      </View>

      <LinearGradient
        colors={['#33121F', '#060814']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <LinearGradient
          colors={['rgba(242, 46, 143, 0.35)', '#0A0E15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6]}
          style={styles.card}
        >
          <LinearGradient
            colors={['transparent', 'rgba(10, 14, 21, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardContent}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: game.coverImageUrl || game.capa }}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(10, 14, 21, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.imageGradient}
              />
            </View>

            <View style={styles.gameInfo} lightColor="transparent" darkColor="transparent">
              <Text style={styles.gameLabel}>JOGO DA SEMANA</Text>
              <Text style={styles.gameName}>{game.title}</Text>
              <Text style={styles.gameDescription} numberOfLines={3}>
                {game.description || 'Confira este jogo incrível da semana'}
              </Text>

              {hasRating ? (
                <View style={styles.ratingContainer} lightColor="transparent" darkColor="transparent">
                  {Array.from({ length: MAX_STARS }, (_, index) => (
                    <Ionicons
                      key={index}
                      name={starName(averageRating, index)}
                      size={11}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.rating}>
                    {averageRating.toFixed(1)}/5 · {reviewCount}{' '}
                    {reviewCount === 1 ? 'avaliação' : 'avaliações'}
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => onGamePress?.(game.id)}
          >
            <AntDesign name="right" size={20} color="#334056" />
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

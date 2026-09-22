import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import gameService, { GameDTO, GenreDTO } from '@/services/gameService';
import reviewService from '@/services/reviewService';
import { styles } from './styles';

interface GamePageProps {
  gameId: string;
  onReviewsPress?: () => void;
}

export default function GamePage({ gameId, onReviewsPress }: GamePageProps) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [reviewsAverage, setReviewsAverage] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      setLoading(true);
      setError(false);
      const [gameData, genresData, reviewsPage] = await Promise.all([
        gameService.buscarJogoPorId(gameId),
        gameService.listarGeneros(),
        reviewService.buscarPaginaDeAvaliacoes(gameId).catch((err) => {
          console.error('Erro ao carregar avaliações do jogo:', err);
          return null;
        }),
      ]);

      if (!gameData) {
        setError(true);
        return;
      }

      setGame(gameData);
      setGenres(genresData);
      setReviewsAverage(reviewsPage?.average ?? 0);
      setReviewsCount(reviewsPage?.reviews.length ?? 0);
    } catch (err) {
      console.error('Erro ao carregar detalhes do jogo:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F52E8F" />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Não foi possível carregar este jogo.</Text>
      </View>
    );
  }

  const genreNames = (game.genreIds || [])
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const starRating = reviewsAverage;
  const filledStars = Math.round(starRating);
  const formattedDate = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString('pt-BR')
    : '—';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{game.title}</Text>

      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: game.coverImageUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      </View>

      {genreNames.length > 0 && (
        <View style={styles.genreRow}>
          {genreNames.map((name) => (
            <View key={name} style={styles.genreTag}>
              <Text style={styles.genreTagText}>{name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <LinearGradient
            colors={['#0559AB', '#F22E8F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.sectionGradientBar}
          />
          <Text style={styles.sectionTitle}>Descrição</Text>
        </View>
        <Text style={styles.description}>
          {game.description || 'Sem descrição disponível para este jogo.'}
        </Text>
      </View>

      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>DESENVOLVEDOR</Text>
          <Text style={styles.infoValue}>{game.developer || '—'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PUBLICADORA</Text>
          <Text style={styles.infoValue}>{game.publisher || '—'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>LANÇAMENTO</Text>
          <Text style={styles.infoValue}>{formattedDate}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.ratingRow}
        activeOpacity={0.8}
        onPress={onReviewsPress}
        disabled={!onReviewsPress}
      >
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((position) => (
            <Ionicons
              key={position}
              name={position <= filledStars ? 'star' : 'star-outline'}
              size={16}
              color="#FFD700"
            />
          ))}
          <Text style={styles.ratingText}>
            {starRating.toFixed(1)}/5 · {reviewsCount} avaliações
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#5C6478" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playlistButton}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Adicionar à playlist:', game.id);
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color="#F5F7FF" />
        <Text style={styles.playlistButtonText}>Adicionar à playlist</Text>
      </TouchableOpacity>
    </View>
  );
}

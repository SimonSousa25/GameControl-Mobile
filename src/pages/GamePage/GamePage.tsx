import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import PlaylistFormModal, {
  PlaylistFormValues,
} from '@/components/modals/PlaylistFormModal/PlaylistFormModal';
import PlaylistPickerModal from '@/components/modals/PlaylistPickerModal/PlaylistPickerModal';
import gameService, { GameDTO, GenreDTO } from '@/services/gameService';
import playlistService, { PlaylistDTO } from '@/services/playlistService';
import reviewService from '@/services/reviewService';
import { styles } from './styles';

interface GamePageProps {
  gameId: string;
  userId?: string;
  onReviewsPress?: () => void;
  onLoginRequired?: () => void;
}

interface PlaylistFeedback {
  message: string;
  error?: boolean;
}

export default function GamePage({
  gameId,
  userId,
  onReviewsPress,
  onLoginRequired,
}: GamePageProps) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [reviewsAverage, setReviewsAverage] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedOnceRef = useRef(false);

  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [playlistsError, setPlaylistsError] = useState(false);
  const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [playlistFeedback, setPlaylistFeedback] = useState<PlaylistFeedback | null>(null);

  // Recarrega ao focar a tela: assim a nota média e a contagem de avaliações
  // atualizam quando o usuário volta da tela de reviews.
  useFocusEffect(
    useCallback(() => {
      loadGame();
      setPlaylistFeedback(null);
    }, [gameId]),
  );

  const openPlaylistPicker = async () => {
    if (!userId) {
      onLoginRequired?.();
      return;
    }
    setPlaylistFeedback(null);
    setPickerVisible(true);
    try {
      setLoadingPlaylists(true);
      setPlaylistsError(false);
      setPlaylists(await playlistService.listarPlaylistsDoUsuario(userId));
    } catch (err) {
      console.error('Erro ao carregar playlists do usuário:', err);
      setPlaylistsError(true);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleSelectPlaylist = async (playlist: PlaylistDTO) => {
    try {
      setAddingPlaylistId(playlist.id);
      const updated = await playlistService.adicionarJogo(playlist.id, gameId);
      setPlaylists((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setPickerVisible(false);
      setPlaylistFeedback({ message: `Jogo adicionado à playlist "${playlist.nome}".` });
    } catch (err) {
      console.error('Erro ao adicionar jogo à playlist:', err);
      setPickerVisible(false);
      setPlaylistFeedback({
        message: 'Não foi possível adicionar o jogo. Tente novamente.',
        error: true,
      });
    } finally {
      setAddingPlaylistId(null);
    }
  };

  const openCreateModal = () => {
    setPickerVisible(false);
    setFormModalVisible(true);
  };

  const closeFormModal = () => {
    if (submittingForm) return;
    setFormModalVisible(false);
    setPickerVisible(true);
  };

  const handleCreatePlaylist = async (values: PlaylistFormValues) => {
    if (!userId) return;
    try {
      setSubmittingForm(true);
      const created = await playlistService.criarPlaylist(userId, {
        nome: values.nome,
        descricao: values.descricao || undefined,
        jogosIds: [gameId],
      });
      setPlaylists((prev) => [...prev, created]);
      setFormModalVisible(false);
      setPlaylistFeedback({
        message: `Playlist "${created.nome}" criada com este jogo.`,
      });
    } catch (err) {
      console.error('Erro ao criar playlist:', err);
      setFormModalVisible(false);
      setPlaylistFeedback({
        message: 'Não foi possível criar a playlist. Tente novamente.',
        error: true,
      });
    } finally {
      setSubmittingForm(false);
    }
  };

  const loadGame = async () => {
    try {
      if (!hasLoadedOnceRef.current) {
        setLoading(true);
      }
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
      hasLoadedOnceRef.current = true;
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
        onPress={openPlaylistPicker}
      >
        <Ionicons name="add-circle-outline" size={20} color="#F5F7FF" />
        <Text style={styles.playlistButtonText}>Adicionar à playlist</Text>
      </TouchableOpacity>

      {playlistFeedback ? (
        <Text
          style={[
            styles.playlistFeedback,
            playlistFeedback.error && styles.playlistFeedbackError,
          ]}
        >
          {playlistFeedback.message}
        </Text>
      ) : null}

      <PlaylistPickerModal
        visible={pickerVisible}
        gameId={gameId}
        playlists={playlists}
        loading={loadingPlaylists}
        error={playlistsError}
        addingPlaylistId={addingPlaylistId}
        onClose={() => setPickerVisible(false)}
        onSelect={handleSelectPlaylist}
        onCreatePress={openCreateModal}
      />

      <PlaylistFormModal
        visible={formModalVisible}
        mode="create"
        submitting={submittingForm}
        onClose={closeFormModal}
        onSubmit={handleCreatePlaylist}
      />
    </View>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import BackButton from "@/components/BackButton/BackButton";
import ConfirmModal from "@/components/modals/ConfirmModal/ConfirmModal";
import GamePickerModal from "@/components/modals/GamePickerModal/GamePickerModal";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlaylistFormModal, {
  PlaylistFormValues,
} from "@/components/modals/PlaylistFormModal/PlaylistFormModal";
import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";
import playlistService, { PlaylistDTO } from "@/services/playlistService";

import { styles } from "./styles";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
const GAMES_PAGE_SIZE = 4;

function getCoverUrl(game: GameDTO): string | undefined {
  const cover = game.coverImageUrl || game.capa;
  if (!cover) return undefined;
  if (cover.startsWith("http://") || cover.startsWith("https://")) {
    return cover;
  }
  return `${UPLOADS_BASE_URL}/uploads/${cover}`;
}

export interface PlaylistProps {
  userId: string;
  /** Playlist a ser exibida ao abrir a página (vinda do perfil). */
  initialPlaylistId?: string;
  onBackPress?: () => void;
  onGamePress?: (gameId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export function Playlist({
  userId,
  initialPlaylistId,
  onBackPress,
  onGamePress,
  onTabPress,
}: PlaylistProps) {
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gamesById, setGamesById] = useState<Record<string, GameDTO>>({});
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [gamePickerVisible, setGamePickerVisible] = useState(false);
  const [gamesPage, setGamesPage] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, [userId]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.listarPlaylistsDoUsuario(userId);
      setPlaylists(data);
      const initialIndex = initialPlaylistId
        ? data.findIndex((playlist) => playlist.id === initialPlaylistId)
        : -1;
      setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const currentPlaylist = playlists[currentIndex];

  // Busca os detalhes dos jogos da playlist atual (o backend só guarda os IDs).
  useEffect(() => {
    if (!currentPlaylist) return;
    const missingIds = currentPlaylist.jogosIds.filter((id) => !gamesById[id]);
    if (missingIds.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const fetched = await Promise.all(
          missingIds.map((id) => gameService.buscarJogoPorId(id)),
        );
        if (cancelled) return;
        setGamesById((prev) => {
          const next = { ...prev };
          fetched.forEach((game, index) => {
            if (game) next[missingIds[index]] = game;
          });
          return next;
        });
      } catch (error) {
        console.error("Erro ao carregar jogos da playlist:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlaylist?.id]);

  const currentGames = currentPlaylist
    ? currentPlaylist.jogosIds
        .map((id) => gamesById[id])
        .filter((game): game is GameDTO => Boolean(game))
    : [];

  // Volta pra primeira página sempre que trocar de playlist.
  useEffect(() => {
    setGamesPage(0);
  }, [currentPlaylist?.id]);

  const totalGamesPages = Math.max(
    1,
    Math.ceil(currentGames.length / GAMES_PAGE_SIZE),
  );

  useEffect(() => {
    setGamesPage((page) => Math.min(page, totalGamesPages - 1));
  }, [totalGamesPages]);

  const paginatedGames = currentGames.slice(
    gamesPage * GAMES_PAGE_SIZE,
    gamesPage * GAMES_PAGE_SIZE + GAMES_PAGE_SIZE,
  );
  const canGoPrevGamesPage = gamesPage > 0;
  const canGoNextGamesPage = (gamesPage + 1) * GAMES_PAGE_SIZE < currentGames.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < playlists.length - 1;

  const goToPrev = () => {
    if (canGoPrev) setCurrentIndex((i) => i - 1);
  };

  const goToNext = () => {
    if (canGoNext) setCurrentIndex((i) => i + 1);
  };

  const handleRemoveGame = async (gameId: string) => {
    if (!currentPlaylist) return;
    try {
      const updated = await playlistService.removerJogoDaPlaylist(
        currentPlaylist.id,
        gameId,
      );
      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === updated.id ? updated : playlist,
        ),
      );
    } catch (error) {
      console.error("Erro ao remover jogo da playlist:", error);
    }
  };

  const handleAddGame = async (game: GameDTO) => {
    if (!currentPlaylist) return;
    try {
      const updated = await playlistService.adicionarJogo(
        currentPlaylist.id,
        game.id,
      );
      setGamesById((prev) => ({ ...prev, [game.id]: game }));
      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === updated.id ? updated : playlist,
        ),
      );
      setGamePickerVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar jogo à playlist:", error);
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setFormModalVisible(true);
  };

  const openEditModal = () => {
    if (!currentPlaylist) return;
    setFormMode("edit");
    setFormModalVisible(true);
  };

  const closeFormModal = () => {
    if (submittingForm) return;
    setFormModalVisible(false);
  };

  const openDeleteModal = () => {
    if (!currentPlaylist) return;
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    if (deletingPlaylist) return;
    setDeleteModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (!currentPlaylist) return;
    try {
      setDeletingPlaylist(true);
      await playlistService.deletarPlaylist(currentPlaylist.id);
      setPlaylists((prev) => {
        const next = prev.filter((playlist) => playlist.id !== currentPlaylist.id);
        setCurrentIndex((index) => Math.min(index, Math.max(0, next.length - 1)));
        return next;
      });
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Erro ao excluir playlist:", error);
    } finally {
      setDeletingPlaylist(false);
    }
  };

  const handleSubmitForm = async (values: PlaylistFormValues) => {
    try {
      setSubmittingForm(true);
      if (formMode === "create") {
        const created = await playlistService.criarPlaylist(userId, {
          nome: values.nome,
          descricao: values.descricao || undefined,
        });
        setPlaylists((prev) => {
          const next = [...prev, created];
          setCurrentIndex(next.length - 1);
          return next;
        });
      } else if (currentPlaylist) {
        const updated = await playlistService.atualizarPlaylist(
          currentPlaylist.id,
          {
            ...currentPlaylist,
            nome: values.nome,
            descricao: values.descricao || undefined,
          },
        );
        setPlaylists((prev) =>
          prev.map((playlist) =>
            playlist.id === updated.id ? updated : playlist,
          ),
        );
      }
      setFormModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar playlist:", error);
    } finally {
      setSubmittingForm(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View
          style={styles.spinner}
          lightColor="transparent"
          darkColor="transparent"
        />
        <Text style={styles.loadingText}>CARREGANDO PLAYLISTS</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View
        style={styles.backRow}
        lightColor="transparent"
        darkColor="transparent"
      >
        <BackButton onPress={onBackPress} />

        <TouchableOpacity
          accessibilityLabel="Criar playlist"
          accessibilityRole="button"
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={openCreateModal}
        >
          <Ionicons name="add" size={16} color="#F5F7FF" />
          <Text style={styles.createButtonText}>Criar playlist</Text>
        </TouchableOpacity>
      </View>

      {!currentPlaylist ? (
        <View
          style={styles.emptyContainer}
          lightColor="transparent"
          darkColor="transparent"
        >
          <Ionicons name="albums-outline" size={40} color="#6B7280" />
          <Text style={styles.emptyTitle}>Nenhuma playlist encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Crie uma playlist para organizar seus jogos.
          </Text>
          <TouchableOpacity
            style={styles.createButtonLarge}
            activeOpacity={0.8}
            onPress={openCreateModal}
          >
            <Ionicons name="add" size={18} color="#F5F7FF" />
            <Text style={styles.createButtonText}>Criar playlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.playlistCard}>
            <View
              style={styles.playlistCardTopRow}
              lightColor="transparent"
              darkColor="transparent"
            >
              <View
                style={styles.playlistLabelRow}
                lightColor="transparent"
                darkColor="transparent"
              >
                <LinearGradient
                  colors={["#0559AB", "#F22E8F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.playlistLabelBar}
                />
                <Text style={styles.playlistLabel}>MINHA PLAYLIST</Text>
              </View>
              <View
                style={styles.playlistActionsRow}
                lightColor="transparent"
                darkColor="transparent"
              >
                <TouchableOpacity
                  accessibilityLabel="Editar playlist"
                  accessibilityRole="button"
                  style={styles.editButton}
                  onPress={openEditModal}
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <Path
                      d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      stroke="#0688A8"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                      stroke="#0688A8"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityLabel="Excluir playlist"
                  accessibilityRole="button"
                  style={styles.deleteButton}
                  onPress={openDeleteModal}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF4D5E" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={styles.playlistTitleRow}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.playlistTitle}>{currentPlaylist.nome}</Text>
            </View>
            <Text style={styles.playlistGameCount}>
              {currentPlaylist.jogosIds.length} jogos
            </Text>
            {currentPlaylist.descricao ? (
              <Text style={styles.playlistGenre}>
                {currentPlaylist.descricao}
              </Text>
            ) : null}

            <View style={styles.playlistDivider} />

            <View
              style={styles.pagerRow}
              lightColor="transparent"
              darkColor="transparent"
            >
              <TouchableOpacity
                accessibilityLabel="Adicionar jogo"
                accessibilityRole="button"
                style={styles.addGameButton}
                activeOpacity={0.8}
                onPress={() => setGamePickerVisible(true)}
              >
                <Ionicons name="add" size={14} color="#F5F7FF" />
                <Text style={styles.addGameButtonText}>Adicionar jogo</Text>
              </TouchableOpacity>

              <View
                style={styles.pagerGroup}
                lightColor="transparent"
                darkColor="transparent"
              >
                <TouchableOpacity
                  accessibilityLabel="Playlist anterior"
                  accessibilityRole="button"
                  disabled={!canGoPrev}
                  onPress={goToPrev}
                  style={[
                    styles.pagerButton,
                    !canGoPrev && styles.pagerButtonDisabled,
                  ]}
                >
                  <Ionicons name="chevron-back" size={16} color="#00E5FF" />
                </TouchableOpacity>

                <Text style={styles.pagerLabel}>
                  {currentIndex + 1} / {playlists.length}
                </Text>

                <TouchableOpacity
                  accessibilityLabel="Próxima playlist"
                  accessibilityRole="button"
                  disabled={!canGoNext}
                  onPress={goToNext}
                  style={[
                    styles.pagerButton,
                    !canGoNext && styles.pagerButtonDisabled,
                  ]}
                >
                  <Ionicons name="chevron-forward" size={16} color="#00E5FF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={styles.sectionHeaderRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <View
              style={styles.sectionTitleRow}
              lightColor="transparent"
              darkColor="transparent"
            >
              <LinearGradient
                colors={["#0559AB", "#F22E8F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.sectionAccent}
              />
              <Text style={styles.sectionTitle}>Jogos da playlist</Text>
            </View>
            <Text style={styles.sectionCount}>
              {currentPlaylist.jogosIds.length} jogos
            </Text>
          </View>

          {currentPlaylist.jogosIds.length === 0 ? (
            <View
              style={styles.emptyContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Ionicons name="game-controller-outline" size={32} color="#6B7280" />
              <Text style={styles.emptySubtitle}>
                Nenhum jogo nessa playlist ainda.
              </Text>
            </View>
          ) : (
            <>
              <View
                style={styles.gridWrap}
                lightColor="transparent"
                darkColor="transparent"
              >
                {paginatedGames.map((item) => {
                const coverUrl = getCoverUrl(item);
                return (
                  <View
                    key={item.id}
                    style={styles.card}
                    lightColor="transparent"
                    darkColor="transparent"
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onGamePress?.(item.id)}
                    >
                      <View style={styles.cardCover}>
                        {coverUrl ? (
                          <Image
                            source={{ uri: coverUrl }}
                            style={styles.cardImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={styles.cardImagePlaceholder}
                            lightColor="#0A0E15"
                            darkColor="#0A0E15"
                          >
                            <Ionicons
                              name="game-controller-outline"
                              size={22}
                              color="#334056"
                            />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    <View
                      style={styles.cardBody}
                      lightColor="transparent"
                      darkColor="transparent"
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onGamePress?.(item.id)}
                      >
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeButton}
                        activeOpacity={0.8}
                        onPress={() => handleRemoveGame(item.id)}
                      >
                        <Ionicons name="trash-outline" size={14} color="#FF4D5E" />
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
                })}
              </View>

              {totalGamesPages > 1 ? (
                <View
                  style={styles.gamesPagerRow}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <TouchableOpacity
                    accessibilityLabel="Jogos: página anterior"
                    accessibilityRole="button"
                    disabled={!canGoPrevGamesPage}
                    onPress={() => setGamesPage((page) => page - 1)}
                    style={[
                      styles.pagerButton,
                      !canGoPrevGamesPage && styles.pagerButtonDisabled,
                    ]}
                  >
                    <Ionicons name="chevron-back" size={16} color="#00E5FF" />
                  </TouchableOpacity>

                  <Text style={styles.pagerLabel}>
                    {gamesPage + 1} / {totalGamesPages}
                  </Text>

                  <TouchableOpacity
                    accessibilityLabel="Jogos: próxima página"
                    accessibilityRole="button"
                    disabled={!canGoNextGamesPage}
                    onPress={() => setGamesPage((page) => page + 1)}
                    style={[
                      styles.pagerButton,
                      !canGoNextGamesPage && styles.pagerButtonDisabled,
                    ]}
                  >
                    <Ionicons name="chevron-forward" size={16} color="#00E5FF" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      )}

      <NavBottom activeTab="profile" onTabPress={onTabPress} />

      <PlaylistFormModal
        visible={formModalVisible}
        mode={formMode}
        initialValues={
          formMode === "edit" && currentPlaylist
            ? {
                nome: currentPlaylist.nome,
                descricao: currentPlaylist.descricao ?? "",
              }
            : undefined
        }
        submitting={submittingForm}
        onClose={closeFormModal}
        onSubmit={handleSubmitForm}
      />

      <GamePickerModal
        visible={gamePickerVisible}
        excludeIds={currentPlaylist?.jogosIds ?? []}
        onClose={() => setGamePickerVisible(false)}
        onSelect={handleAddGame}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        title="Excluir playlist"
        message={
          currentPlaylist
            ? `Tem certeza que deseja excluir "${currentPlaylist.nome}"? Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        destructive
        submitting={deletingPlaylist}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </View>
  );
}

export default Playlist;

import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

import Header from "@/components/Header/Header";
import ConfirmModal from "@/components/modals/ConfirmModal/ConfirmModal";
import PlaylistFormModal, {
  PlaylistFormValues,
} from "@/components/modals/PlaylistFormModal/PlaylistFormModal";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlayerFeedSection from "@/components/PlayerFeedSection/PlayerFeedSection";
import PlaylistsSection from "@/components/PlaylistsSection/PlaylistsSection";
import ProfileHeaderCard from "@/components/ProfileHeaderCard/ProfileHeaderCard";
import SectionTabs from "@/components/SectionTabs/SectionTabs";
import { Text, View } from "@/components/Themed";
import playlistService, { PlaylistDTO } from "@/services/playlistService";
import userService, { UserDTO } from "@/services/userService";

import { styles } from "./styles";

const TABS = ["Feed", "Playlists"];

export interface ProfileProps {
  userId: string;
  /** Usuário da sessão: exibido de imediato e usado se a API falhar. */
  initialUser?: UserDTO;
  /** Chamado com os dados frescos da API para manter a sessão atualizada. */
  onUserRefreshed?: (user: UserDTO) => void;
  onSettingsPress?: () => void;
  onFeedPress?: () => void;
  onPlaylistPress?: (playlistId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export function Profile({
  userId,
  initialUser,
  onUserRefreshed,
  onSettingsPress,
  onFeedPress,
  onPlaylistPress,
  onTabPress,
}: ProfileProps) {
  const [user, setUser] = useState<UserDTO | undefined>(initialUser);
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const [playlistToDelete, setPlaylistToDelete] = useState<PlaylistDTO | null>(
    null,
  );
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);

  // Pager horizontal (Feed <-> Playlists) com o card do perfil fixo acima.
  const pagerRef = useRef<ScrollView>(null);
  const [pagerSize, setPagerSize] = useState({ width: 0, height: 0 });
  const [activePage, setActivePage] = useState(0);

  // Mantém o callback num ref para não recriar o loadProfile a cada render.
  const onUserRefreshedRef = useRef(onUserRefreshed);
  onUserRefreshedRef.current = onUserRefreshed;

  // Um erro em uma das chamadas não deve derrubar a tela inteira.
  const loadProfile = useCallback(async () => {
    const [userResult, playlistsResult] = await Promise.allSettled([
      userService.buscarUsuarioPorId(userId),
      playlistService.listarPlaylistsDoUsuario(userId),
    ]);

    if (userResult.status === "fulfilled") {
      setUser(userResult.value);
      onUserRefreshedRef.current?.(userResult.value);
    }
    if (playlistsResult.status === "fulfilled") {
      setPlaylists(playlistsResult.value);
    }
    setLoading(false);
  }, [userId]);

  // Recarrega ao voltar da página de playlists/configurações, pois as
  // contagens e os dados do perfil podem ter mudado.
  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const handlePagerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPagerSize({ width, height });
  };

  // Se a largura mudar (rotação/redimensionar), mantém a página atual.
  useEffect(() => {
    if (pagerSize.width > 0) {
      pagerRef.current?.scrollTo({
        x: activePage * pagerSize.width,
        animated: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagerSize.width]);

  const handlePagerScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (pagerSize.width === 0) return;
    const page = Math.round(
      event.nativeEvent.contentOffset.x / pagerSize.width,
    );
    setActivePage((current) => (current === page ? current : page));
  };

  const goToPage = (page: number) => {
    setActivePage(page);
    pagerRef.current?.scrollTo({ x: page * pagerSize.width, animated: true });
  };

  const closeFormModal = () => {
    if (submittingForm) return;
    setFormModalVisible(false);
  };

  const handleSubmitForm = async (values: PlaylistFormValues) => {
    try {
      setSubmittingForm(true);
      const created = await playlistService.criarPlaylist(userId, {
        nome: values.nome,
        descricao: values.descricao || undefined,
      });
      setPlaylists((prev) => [...prev, created]);
      setFormModalVisible(false);
    } catch {
      Alert.alert(
        "Não foi possível criar a playlist",
        "Tente novamente em instantes.",
      );
    } finally {
      setSubmittingForm(false);
    }
  };

  const closeDeleteModal = () => {
    if (deletingPlaylist) return;
    setPlaylistToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!playlistToDelete) return;
    try {
      setDeletingPlaylist(true);
      await playlistService.deletarPlaylist(playlistToDelete.id);
      setPlaylists((prev) =>
        prev.filter((playlist) => playlist.id !== playlistToDelete.id),
      );
      setPlaylistToDelete(null);
    } catch {
      Alert.alert(
        "Não foi possível excluir a playlist",
        "Tente novamente em instantes.",
      );
    } finally {
      setDeletingPlaylist(false);
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
        <Text style={styles.loadingText}>CARREGANDO PERFIL</Text>
      </View>
    );
  }

  const pageStyle = { width: pagerSize.width, height: pagerSize.height };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View style={styles.content} lightColor="transparent" darkColor="transparent">
        {/* Fixo: não rola nem acompanha o swipe */}
        <ProfileHeaderCard
          user={user}
          playlistsCount={playlists.length}
          onSettingsPress={onSettingsPress}
        />

        <SectionTabs tabs={TABS} activeIndex={activePage} onTabPress={goToPage} />

        <View
          style={styles.pager}
          lightColor="transparent"
          darkColor="transparent"
          onLayout={handlePagerLayout}
        >
          {pagerSize.width > 0 ? (
            <ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handlePagerScroll}
            >
              <ScrollView
                style={pageStyle}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <PlayerFeedSection onExpandPress={onFeedPress} />
              </ScrollView>

              <ScrollView
                style={pageStyle}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <PlaylistsSection
                  playlists={playlists}
                  onCreatePress={() => setFormModalVisible(true)}
                  onPlaylistPress={onPlaylistPress}
                  onDeletePress={setPlaylistToDelete}
                />
              </ScrollView>
            </ScrollView>
          ) : null}
        </View>
      </View>

      <NavBottom activeTab="profile" onTabPress={onTabPress} />

      <PlaylistFormModal
        visible={formModalVisible}
        mode="create"
        submitting={submittingForm}
        onClose={closeFormModal}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        visible={playlistToDelete !== null}
        title="Excluir playlist"
        message="Tem certeza que deseja excluir essa playlist?"
        warning="Essa ação não poderá ser desfeita"
        confirmLabel="Excluir"
        destructive
        submitting={deletingPlaylist}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </View>
  );
}

export default Profile;

import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";

import Header from "@/components/Header/Header";
import ConfirmModal from "@/components/modals/ConfirmModal/ConfirmModal";
import FollowListModal from "@/components/modals/FollowListModal/FollowListModal";
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
import { useSectionPager } from "@/utils/useSectionPager";

import { styles } from "./styles";

const TABS = ["Feed", "Playlists"];

export interface ProfileProps {
  userId: string;
  initialUser?: UserDTO;
  onUserRefreshed?: (user: UserDTO) => void;
  onSettingsPress?: () => void;
  onFeedPress?: () => void;
  onPlaylistPress?: (playlistId: string) => void;
  onTabPress?: (tabId: string) => void;
  onSearchSubmit?: (searchTerm: string) => void;
  onUserPress?: (userId: string) => void;
}

export function Profile({
  userId,
  initialUser,
  onUserRefreshed,
  onSettingsPress,
  onSearchSubmit,
  onFeedPress,
  onPlaylistPress,
  onTabPress,
  onUserPress,
}: ProfileProps) {
  const [user, setUser] = useState<UserDTO | undefined>(initialUser);
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState(true);


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = () => {
    onSearchSubmit?.(searchTerm.trim());
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const [playlistToDelete, setPlaylistToDelete] = useState<PlaylistDTO | null>(
    null,
  );
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);

  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followModalMode, setFollowModalMode] = useState<"followers" | "following">(
    "followers",
  );

  const openFollowModal = (mode: "followers" | "following") => {
    setFollowModalMode(mode);
    setFollowModalVisible(true);
  };

  const { pagerRef, pagerSize, activePage, onPagerLayout, onPagerScroll, goToPage } =
    useSectionPager();

  const onUserRefreshedRef = useRef(onUserRefreshed);
  onUserRefreshedRef.current = onUserRefreshed;

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

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

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
        <Header
          variant={isSearchOpen ? "search" : "icon"}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchPress={() => setIsSearchOpen(true)}
          onSearchSubmit={handleSearchSubmit}
          onClose={closeSearch}
          autoFocusSearch={isSearchOpen}
        />
      </View>

      <View style={styles.content} lightColor="transparent" darkColor="transparent">
        {/* Fixo: não rola nem acompanha o swipe */}
        <ProfileHeaderCard
          user={user}
          playlistsCount={playlists.length}
          onSettingsPress={onSettingsPress}
          onFollowersPress={() => openFollowModal("followers")}
          onFollowingPress={() => openFollowModal("following")}
        />

        <SectionTabs tabs={TABS} activeIndex={activePage} onTabPress={goToPage} />

        <View
          style={styles.pager}
          lightColor="transparent"
          darkColor="transparent"
          onLayout={onPagerLayout}
        >
          {pagerSize.width > 0 ? (
            <ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onPagerScroll}
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

      <FollowListModal
        visible={followModalVisible}
        mode={followModalMode}
        userIds={
          followModalMode === "following"
            ? user?.following ?? []
            : user?.followers ?? []
        }
        onClose={() => setFollowModalVisible(false)}
        onUserPress={(pressedUserId) => onUserPress?.(pressedUserId)}
      />
    </View>
  );
}

export default Profile;

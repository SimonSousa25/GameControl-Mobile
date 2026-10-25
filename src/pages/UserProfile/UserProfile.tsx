import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import FollowButton from "@/components/FollowButton/FollowButton";
import Header from "@/components/Header/Header";
import FollowListModal from "@/components/modals/FollowListModal/FollowListModal";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlaylistsSection from "@/components/PlaylistsSection/PlaylistsSection";
import PrivateProfileNotice from "@/components/PrivateProfileNotice/PrivateProfileNotice";
import ProfileHeaderCard from "@/components/ProfileHeaderCard/ProfileHeaderCard";
import SectionPager from "@/components/SectionPager/SectionPager";
import SectionTabs from "@/components/SectionTabs/SectionTabs";
import { Text, View } from "@/components/Themed";
import UserPostsSection from "@/components/UserPostsSection/UserPostsSection";
import { isTooManyRequestsError } from "@/services/apiError";
import playlistService, { PlaylistDTO } from "@/services/playlistService";
import userService, { UserDTO } from "@/services/userService";
import { useSectionPager } from "@/utils/useSectionPager";

import { styles } from "./styles";

const TABS = ["Posts", "Playlists"];

export interface UserProfileProps {
  userId: string;
  viewerId: string;
  onBackPress?: () => void;
  onPlaylistPress?: (playlistId: string) => void;
  onTabPress?: (tabId: string) => void;
  onSearchSubmit?: (searchTerm: string) => void;
  onUserPress?: (userId: string) => void;
}


export function UserProfile({
  userId,
  viewerId,
  onBackPress,
  onPlaylistPress,
  onTabPress,
  onSearchSubmit,
  onUserPress,
}: UserProfileProps) {
  const [user, setUser] = useState<UserDTO | undefined>();
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  // Perfil privado: pedido para seguir aguardando aprovação do dono.
  const [requested, setRequested] = useState(false);
  // Segundos até poder pedir de novo após uma recusa (0 = já pode).
  const [retryAfter, setRetryAfter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followModalMode, setFollowModalMode] = useState<"followers" | "following">(
    "followers",
  );

  const openFollowModal = (mode: "followers" | "following") => {
    setFollowModalMode(mode);
    setFollowModalVisible(true);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pager = useSectionPager();
  const { activePage, goToPage } = pager;

  const isFollowing = user?.followers?.includes(viewerId) ?? false;
  // Perfil privado: posts e playlists só aparecem para quem segue.
  const isLocked = user?.isPrivate === true && !isFollowing;

  // Conta regressiva do tempo de espera depois de um pedido recusado.
  const cooling = retryAfter > 0;
  useEffect(() => {
    if (!cooling) return;
    const timer = setInterval(
      () => setRetryAfter((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [cooling]);

  const loadFollowStatus = useCallback(async () => {
    try {
      const status = await userService.buscarStatusSeguir(viewerId, userId);
      setRequested(status.status === "REQUESTED");
      setRetryAfter(status.retryAfterSeconds ?? 0);
    } catch {
      // Mantém o último estado conhecido; o próximo carregamento tenta de novo.
    }
  }, [viewerId, userId]);

  const loadProfile = useCallback(async () => {
    try {
      const loadedUser = await userService.buscarUsuarioPorId(userId);
      setUser(loadedUser);
      setNotFound(false);

      const following = loadedUser.followers?.includes(viewerId) ?? false;
      const locked = loadedUser.isPrivate === true && !following;

      if (following || !loadedUser.isPrivate) {
        setRequested(false);
        setRetryAfter(0);
      }

      // Perfil privado sem acesso: nem tenta buscar as playlists (o backend
      // responderia 403); só consulta se já existe um pedido pendente.
      if (locked) {
        setPlaylists([]);
        await loadFollowStatus();
      } else {
        try {
          setPlaylists(await playlistService.listarPlaylistsDoUsuario(userId));
        } catch {
          // Mantém as playlists já carregadas.
        }
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [userId, viewerId, loadFollowStatus]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleToggleFollow = async () => {
    if (!user || followingLoading) return;
    const snapshot = user;
    const wasFollowing = isFollowing;
    const wasRequested = requested;
    const currentFollowers = user.followers ?? [];

    setFollowingLoading(true);
    try {
      // "Seguindo" deixa de seguir; "Solicitado" cancela o pedido pendente.
      if (wasFollowing || wasRequested) {
        if (wasFollowing) {
          setUser({
            ...user,
            followers: currentFollowers.filter((id) => id !== viewerId),
            followersCount: undefined,
          });
        }
        await userService.deixarDeSeguirUsuario(viewerId, userId);
        setRequested(false);
        return;
      }

      const result = await userService.seguirUsuario(viewerId, userId);
      if (result === "REQUESTED") {
        // Perfil privado: fica aguardando o dono aceitar.
        setRequested(true);
        setRetryAfter(0);
      } else {
        setUser({
          ...user,
          followers: [...currentFollowers.filter((id) => id !== viewerId), viewerId],
          followersCount: undefined,
        });
      }
    } catch (error) {
      setUser(snapshot);
      if (isTooManyRequestsError(error)) {
        await loadFollowStatus();
        Alert.alert(
          "Pedido recusado",
          "Seu pedido foi recusado há pouco tempo. Aguarde para tentar de novo.",
        );
      } else {
        Alert.alert(
          wasFollowing
            ? "Não foi possível deixar de seguir"
            : wasRequested
              ? "Não foi possível cancelar o pedido"
              : "Não foi possível seguir",
          "Tente novamente em instantes.",
        );
      }
    } finally {
      setFollowingLoading(false);
    }
  };

  const handleSearchSubmit = () => onSearchSubmit?.(searchTerm.trim());
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
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

  const profileHeaderCard = user ? (
    <ProfileHeaderCard
      user={user}
      playlistsCount={isLocked ? undefined : playlists.length}
      followAction={
        <FollowButton
          following={isFollowing}
          requested={requested}
          cooldownSeconds={retryAfter}
          loading={followingLoading}
          onPress={handleToggleFollow}
        />
      }
      onFollowersPress={() => openFollowModal("followers")}
      onFollowingPress={() => openFollowModal("following")}
    />
  ) : null;

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

      <View style={styles.backRow} lightColor="transparent" darkColor="transparent">
        <BackButton onPress={onBackPress} />
      </View>

      {notFound || !user ? (
        <View style={styles.emptyContainer} lightColor="transparent" darkColor="transparent">
          <Text style={styles.emptyTitle}>Usuário não encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Não foi possível carregar este perfil.
          </Text>
        </View>
      ) : isLocked ? (
        <View style={styles.content} lightColor="transparent" darkColor="transparent">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pageContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#F52E8F"
              />
            }
          >
            {profileHeaderCard}
            <PrivateProfileNotice requested={requested} />
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          {/* Fora do pager: o cartão e as abas não deslizam junto com as páginas. */}
          {profileHeaderCard}
          <SectionTabs tabs={TABS} activeIndex={activePage} onTabPress={goToPage} />

          <SectionPager pager={pager}>
            <UserPostsSection userId={userId} viewerId={viewerId} />
            <PlaylistsSection
              playlists={playlists}
              readOnly
              onPlaylistPress={onPlaylistPress}
            />
          </SectionPager>
        </ScrollView>
      )}

      <NavBottom activeTab={null} onTabPress={onTabPress} />

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

export default UserProfile;
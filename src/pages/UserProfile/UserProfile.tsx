import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import FollowButton from "@/components/FollowButton/FollowButton";
import Header from "@/components/Header/Header";
import FollowListModal from "@/components/modals/FollowListModal/FollowListModal";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlaylistsSection from "@/components/PlaylistsSection/PlaylistsSection";
import ProfileHeaderCard from "@/components/ProfileHeaderCard/ProfileHeaderCard";
import SectionTabs from "@/components/SectionTabs/SectionTabs";
import { Text, View } from "@/components/Themed";
import UserPostsSection from "@/components/UserPostsSection/UserPostsSection";
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

  const { pagerRef, pagerSize, activePage, onPagerLayout, onPagerScroll, goToPage } =
    useSectionPager();

  const isFollowing = user?.followers?.includes(viewerId) ?? false;

  const loadProfile = useCallback(async () => {
    const [userResult, playlistsResult] = await Promise.allSettled([
      userService.buscarUsuarioPorId(userId),
      playlistService.listarPlaylistsDoUsuario(userId),
    ]);

    if (userResult.status === "fulfilled") {
      setUser(userResult.value);
      setNotFound(false);
    } else {
      setNotFound(true);
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

  const handleToggleFollow = async () => {
    if (!user || followingLoading) return;
    const wasFollowing = isFollowing;
    const currentFollowers = user.followers ?? [];

    setUser({
      ...user,
      followers: wasFollowing
        ? currentFollowers.filter((id) => id !== viewerId)
        : [...currentFollowers.filter((id) => id !== viewerId), viewerId],
      followersCount: undefined,
    });
    setFollowingLoading(true);
    try {
      if (wasFollowing) {
        await userService.deixarDeSeguirUsuario(viewerId, userId);
      } else {
        await userService.seguirUsuario(viewerId, userId);
      }
    } catch {
      setUser(user);
      Alert.alert(
        wasFollowing
          ? "Não foi possível deixar de seguir"
          : "Não foi possível seguir",
        "Tente novamente em instantes.",
      );
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
      ) : (
        <View style={styles.content} lightColor="transparent" darkColor="transparent">
          <ProfileHeaderCard
            user={user}
            playlistsCount={playlists.length}
            followAction={
              <FollowButton
                following={isFollowing}
                loading={followingLoading}
                onPress={handleToggleFollow}
              />
            }
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
                  <UserPostsSection />
                </ScrollView>

                <ScrollView
                  style={pageStyle}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageContent}
                >
                  <PlaylistsSection
                    playlists={playlists}
                    readOnly
                    onPlaylistPress={onPlaylistPress}
                  />
                </ScrollView>
              </ScrollView>
            ) : null}
          </View>
        </View>
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

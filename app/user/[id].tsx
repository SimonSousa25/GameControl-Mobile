import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/src/contexts/AuthContext";
import UserProfile from "@/pages/UserProfile/UserProfile";

export default function UserProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/home");
  };

  const handleTabPress = (tabId: string) => {
    if (tabId === "home") {
      router.replace("/home");
      return;
    }
    if (tabId === "catalog") {
      router.push("/catalog");
      return;
    }
    if (tabId === "profile") {
      router.replace("/profile");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm) {
      router.push({ pathname: "/catalog", params: { search: searchTerm } });
    } else {
      router.push("/catalog");
    }
  };

  if (!user) return <Redirect href="/login" />;
  if (!id) return <Redirect href="/home" />;
  // Abrir o próprio id cai na tela de perfil próprio.
  if (id === user.id) return <Redirect href="/profile" />;

  return (
    <UserProfile
      userId={id}
      viewerId={user.id}
      onBackPress={goBack}
      onSearchSubmit={handleSearchSubmit}
      onPlaylistPress={(playlistId) =>
        router.push({
          pathname: "/playlists",
          params: { playlistId, ownerId: id },
        })
      }
      onTabPress={handleTabPress}
      onUserPress={(pressedUserId) => router.push(`/user/${pressedUserId}`)}
    />
  );
}

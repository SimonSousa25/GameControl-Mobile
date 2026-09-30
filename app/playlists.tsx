import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/src/contexts/AuthContext";

import Playlist from "@/pages/Playlist/Playlist";

export default function PlaylistsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { playlistId, ownerId } = useLocalSearchParams<{
    playlistId?: string;
    ownerId?: string;
  }>();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/profile");
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

  if (!user) return <Redirect href="/login" />;

  const playlistOwnerId = ownerId ?? user.id;
  const readOnly = playlistOwnerId !== user.id;

  return (
    <Playlist
      userId={playlistOwnerId}
      readOnly={readOnly}
      initialPlaylistId={playlistId}
      onBackPress={goBack}
      onGamePress={(gameId) => router.push(`/game/${gameId}`)}
      onTabPress={handleTabPress}
    />
  );
}

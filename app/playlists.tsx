import { useRouter } from "expo-router";

import Playlist from "@/pages/Playlist/Playlist";

// TODO: Substituir pelo ID do usuário autenticado quando o contexto de
// autenticação/sessão existir (ainda não há login persistido no app).
const CURRENT_USER_ID_PLACEHOLDER = "me";

export default function PlaylistsScreen() {
  const router = useRouter();

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

  return (
    <Playlist
      userId={CURRENT_USER_ID_PLACEHOLDER}
      onBackPress={goBack}
      onGamePress={(gameId) => router.push(`/game/${gameId}`)}
      onTabPress={handleTabPress}
    />
  );
}

import { useLocalSearchParams, useRouter } from "expo-router";

import Reviews from "@/pages/Reviews/Reviews";

// TODO: Substituir pelo ID do usuário autenticado quando o contexto de
// autenticação/sessão existir (ainda não há login persistido no app).
const CURRENT_USER_ID_PLACEHOLDER = "me";

export default function GameReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(`/game/${id}`);
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
      router.push("/profile");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  if (!id) return null;

  return (
    <Reviews
      gameId={id}
      userId={CURRENT_USER_ID_PLACEHOLDER}
      onBackPress={goBack}
      onTabPress={handleTabPress}
    />
  );
}

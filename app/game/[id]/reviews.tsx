import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

import Reviews from "@/pages/Reviews/Reviews";

export default function GameReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

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

  if (!user) return <Redirect href="/login" />;
  if (!id) return null;

  return (
    <Reviews
      gameId={id}
      userId={user.id}
      onBackPress={goBack}
      onTabPress={handleTabPress}
    />
  );
}

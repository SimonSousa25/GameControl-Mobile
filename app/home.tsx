import { useRouter } from "expo-router";

import { useAuth } from "@/src/contexts/AuthContext";
import Home from "@/pages/Home/Home";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm) {
      router.push({ pathname: "/catalog", params: { search: searchTerm } });
    } else {
      router.push("/catalog");
    }
  };

  const handleTabPress = (tabId: string) => {
    if (tabId === "catalog") {
      router.push("/catalog");
      return;
    }
    if (tabId === "profile") {
      router.push("/profile");
      return;
    }
    if (tabId === "home") {
      return;
    }
    if (tabId === "feed") {
      router.push("/feed");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  return (
    <Home
      userId={user?.id}
      onSearchSubmit={handleSearchSubmit}
      onFeaturedGamePress={(gameId) => {
        router.push(`/game/${gameId}`);
      }}
      onGamePress={(gameId) => {
        router.push(`/game/${gameId}`);
      }}
      onViewAllFeaturedPress={() => {
        router.push("/catalog");
      }}
      onUserPress={(userId) => {
        router.push(`/user/${userId}`);
      }}
      onViewAllPlayersPress={() => {
        router.push("/players");
      }}
      onViewFeedPress={() => {
        router.push("/feed");
      }}
      onTabPress={handleTabPress}
    />
  );
}

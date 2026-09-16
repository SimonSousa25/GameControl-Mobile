import { useRouter } from "expo-router";

import Home from "@/pages/Home/Home";

export default function HomeScreen() {
  const router = useRouter();

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
    // TODO: Criar rota de feed quando existir.
    console.log(`${tabId} pressed`);
  };

  return (
    <Home
      onSearchSubmit={handleSearchSubmit}
      onFeaturedGamePress={(gameId) => {
        console.log("Game pressed:", gameId);
      }}
      onGamePress={(gameId) => {
        router.push(`/game/${gameId}`);
      }}
      onViewAllFeaturedPress={() => {
        console.log("View all pressed");
      }}
      onUserPress={(userId) => {
        console.log("User pressed:", userId);
      }}
      onViewAllPlayersPress={() => {
        console.log("View all players pressed");
      }}
      onTabPress={handleTabPress}
    />
  );
}

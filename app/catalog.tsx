import { useLocalSearchParams, useRouter } from "expo-router";

import Catalog from "@/components/Catalog/Catalog";

export default function CatalogScreen() {
  const router = useRouter();
  const { search } = useLocalSearchParams<{ search?: string }>();

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
      return;
    }
    console.log(`${tabId} pressed`);
  };

  return (
    <Catalog
      initialSearch={typeof search === "string" ? search : ""}
      onBackPress={goBack}
      onGamePress={(gameId) => router.push(`/game/${gameId}`)}
      onTabPress={handleTabPress}
    />
  );
}

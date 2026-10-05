import { useRouter } from "expo-router";

import Players from "@/pages/Players/Players";

export default function PlayersScreen() {
  const router = useRouter();

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
      router.push("/profile");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  return (
    <Players
      onBackPress={goBack}
      onUserPress={(userId) => router.push(`/user/${userId}`)}
      onSearchPress={() => router.push("/catalog")}
      onTabPress={handleTabPress}
    />
  );
}

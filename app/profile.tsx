import { useRouter } from "expo-router";

import Profile from "@/pages/Profile/Profile";

export default function ProfileScreen() {
  const router = useRouter();

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
      return;
    }
    console.log(`${tabId} pressed`);
  };

  return (
    <Profile
      onPlaylistsPress={() => router.push("/playlists")}
      onTabPress={handleTabPress}
    />
  );
}

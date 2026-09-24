import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/pages/Profile/Profile";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

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

  if (!user) return <Redirect href="/login" />;

  return (
    <Profile
      userId={user.id}
      initialUser={user}
      onUserRefreshed={updateUser}
      onSettingsPress={() => router.push("/settings")}
      onPlaylistPress={(playlistId) =>
        router.push({ pathname: "/playlists", params: { playlistId } })
      }
      onTabPress={handleTabPress}
    />
  );
}

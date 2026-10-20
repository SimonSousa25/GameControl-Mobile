import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/src/contexts/AuthContext";
import Feed from "@/pages/Feed/Feed";

export default function FeedScreen() {
  const router = useRouter();
  const { user } = useAuth();

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
    if (tabId === "feed") {
      return;
    }
    console.log(`${tabId} pressed`);
  };

  if (!user) return <Redirect href="/login" />;

  return (
    <Feed
      userId={user.id}
      onBackPress={goBack}
      onTabPress={handleTabPress}
      onUserPress={(pressedUserId) => router.push(`/user/${pressedUserId}`)}
    />
  );
}

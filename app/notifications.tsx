import { Redirect, useRouter } from "expo-router";

import Notifications from "@/pages/Notifications/Notifications";
import { useAuth } from "@/src/contexts/AuthContext";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return <Redirect href="/login" />;

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
    <Notifications
      userId={user.id}
      onBackPress={goBack}
      onActorPress={(actorId) => router.push(`/user/${actorId}`)}
      onSearchPress={() => router.push("/catalog")}
      onTabPress={handleTabPress}
    />
  );
}

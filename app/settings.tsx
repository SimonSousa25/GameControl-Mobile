import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import Settings from "@/pages/Settings/Settings";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/profile");
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
      router.replace("/profile");
      return;
    }
    console.log(`${tabId} pressed`);
  };

  const handleLogout = async () => {
    await signOut();
    // Limpa o histórico para o botão voltar não retornar a telas autenticadas.
    if (router.canDismiss()) router.dismissAll();
    router.replace("/login");
  };

  return (
    <Settings
      onBackPress={goBack}
      onLogoutPress={handleLogout}
      onTabPress={handleTabPress}
    />
  );
}

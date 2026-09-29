import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import Settings, {
  SettingsFormValues,
} from "@/pages/Settings/Settings";
import userService from "@/services/userService";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser, signOut } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  const handleSave = async (values: SettingsFormValues) => {
    const updatedUser = await userService.atualizarUsuario(user.id, {
      username: values.username,
      bio: values.bio,
      country: values.country,
    });

    // Mantém os dados atualizados na sessão do aplicativo.
    await updateUser(updatedUser);
  };

  const handleLogout = async () => {
    await signOut();

    if (router.canDismiss()) {
      router.dismissAll();
    }

    router.replace("/login");
  };

  return (
    <Settings
      user={user}
      onBackPress={() => router.back()}
      onSave={handleSave}
      onLogoutPress={handleLogout}
      onTabPress={(tabId) => {
        if (tabId === "home") router.replace("/home");
        if (tabId === "catalog") router.push("/catalog");
        if (tabId === "profile") router.replace("/profile");
      }}
    />
  );
}
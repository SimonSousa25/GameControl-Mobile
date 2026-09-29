import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import Settings, { SettingsFormValues } from "@/pages/Settings/Settings";
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

    // redireciona somente depois que as alterações forem salvas
    router.replace("/profile");
  };

  const handleProfilePictureChange = async (base64Image: string) => {
    const updatedUser = await userService.atualizarFotoPerfil(
      user.id,
      base64Image,
    );

    // Atualiza imediatamente a foto exibida no perfil, header e navegação.
    await updateUser(updatedUser);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    const normalizedSearch = searchTerm.trim();

    if (normalizedSearch) {
      router.push({
        pathname: "/catalog",
        params: { search: normalizedSearch },
      });
      return;
    }

    router.push("/catalog");
  };

  const handleLogout = async () => {
    await signOut();

    // Limpa o histórico para o botão voltar não retornar a telas autenticadas.
    if (router.canDismiss()) router.dismissAll();

    router.replace("/login");
  };

  return (
    <Settings
      user={user}
      onBackPress={() => router.back()}
      onProfilePictureChange={handleProfilePictureChange}
      onSearchSubmit={handleSearchSubmit}
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

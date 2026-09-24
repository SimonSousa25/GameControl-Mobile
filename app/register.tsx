import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import Register from "@/pages/Register/Register";
import type { AuthResponse } from "@/services/userService";

export default function RegisterScreen() {
  const router = useRouter();
  const { user, signIn } = useAuth();

  if (user) {
    return <Redirect href="/home" />;
  }

  const goToLogin = () => {
    router.replace("/login");
  };

  // Cadastro concluído + login automático: salva a sessão e vai para a home.
  const handleRegisterSuccess = async (auth: AuthResponse) => {
    await signIn(auth);
    router.replace("/home");
  };

  return <Register onLoginPress={goToLogin} onSuccess={handleRegisterSuccess} />;
}

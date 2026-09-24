import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login/Login";
import type { AuthResponse } from "@/services/userService";

export default function LoginScreen() {
  const router = useRouter();
  const { user, signIn } = useAuth();

  // Já existe sessão salva: pula o login (também vale para a rota "/").
  if (user) {
    return <Redirect href="/home" />;
  }

  const goToRegister = () => {
    router.push("/register");
  };

  const handleLoginSuccess = async (auth: AuthResponse) => {
    await signIn(auth);
    router.replace("/home");
  };

  const handleForgotPassword = () => {
    // TODO: Criar fluxo de recuperação de senha quando a tela existir.
    router.push("/forgot-password");
  };

  return (
    <Login
      onForgotPasswordPress={handleForgotPassword}
      onRegisterPress={goToRegister}
      onSuccess={handleLoginSuccess}
    />
  );
}

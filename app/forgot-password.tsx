import { useRouter } from "expo-router";

import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import authService, { ehUsuarioInexistente } from "@/services/authService";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    try {
      // O Firebase envia um e-mail com o link para criar uma nova senha.
      await authService.recuperarSenha(email);
    } catch (error) {
      // Não revela se o e-mail tem conta: o resultado na tela é o mesmo.
      if (!ehUsuarioInexistente(error)) throw error;
    }

    router.replace("/forgot-password-two");
  };

  return (
    <ForgotPassword
      onBackToLoginPress={() => router.replace("/login")}
      onSubmit={handleSubmit}
    />
  );
}
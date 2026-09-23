import { Alert } from "react-native";
import { useRouter } from "expo-router";

import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    // Temporário: ainda não existe endpoint de recuperação no backend.
    Alert.alert(
      "Recuperação solicitada",
      `Quando a API estiver pronta, enviaremos as instruções para ${email}.`,
    );
  };

  return (
    <ForgotPassword
      onBackToLoginPress={() => router.replace("/login")}
      onSubmit={handleSubmit}
    />
  );
}

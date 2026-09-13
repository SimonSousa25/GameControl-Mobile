import { useRouter } from "expo-router";

import Login from "@/components/Login/Login";

export default function LoginScreen() {
  const router = useRouter();

  const goToRegister = () => {
    router.push("/register");
  };

  const goToHome = () => {
    router.replace("/home");
  };

  const handleForgotPassword = () => {
    // TODO: Criar fluxo de recuperação de senha quando a tela existir.
    console.log("Esqueceu sua senha pressed");
  };

  return (
    <Login
      onForgotPasswordPress={handleForgotPassword}
      onRegisterPress={goToRegister}
      onSuccess={goToHome}
    />
  );
}

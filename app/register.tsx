import { useRouter } from "expo-router";

import Register from "@/components/Register/Register";

export default function RegisterScreen() {
  const router = useRouter();

  const returnToPreviousScreen = () => {
    // Depois troque este retorno por router.replace("/login") quando a tela de login existir.
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <Register
      onLoginPress={returnToPreviousScreen}
      onSuccess={returnToPreviousScreen}
    />
  );
}

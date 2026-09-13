import { useRouter } from "expo-router";

import Register from "@/components/Register/Register";

export default function RegisterScreen() {
  const router = useRouter();

  const goToLogin = () => {
    router.replace("/login");
  };

  return (
    <Register
      onLoginPress={goToLogin}
      onSuccess={goToLogin}
    />
  );
}

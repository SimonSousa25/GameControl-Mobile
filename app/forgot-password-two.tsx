import { useRouter } from "expo-router";

import ForgotPasswordTwo from "@/pages/ForgotPasswordTwo/ForgotPasswordTwo";

export default function ForgotPasswordTwoScreen() {
  const router = useRouter();

  return (
    <ForgotPasswordTwo
      onBackToPrevScreen={() => router.replace("/forgot-password")}
      onBackToLoginPress={() => router.replace("/login")}
    />
  );
}

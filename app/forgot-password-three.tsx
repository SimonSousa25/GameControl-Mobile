import { useRouter } from "expo-router";

import ForgotPasswordThree from "@/pages/ForgotPasswordThree/ForgotPasswordThree";

export default function ForgotPasswordThreeScreen() {
  const router = useRouter();

  return (
    <ForgotPasswordThree
      // A navegação ocorrerá somente após a API confirmar a alteração.
      onPasswordChanged={() => router.replace("/login")}
    />
  );
}

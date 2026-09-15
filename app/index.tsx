import { useRouter } from "expo-router";
import { useEffect } from "react";

import Presentation from "@/pages/Presentation/Presentation";

const PRESENTATION_DURATION_MS = 2000;

export default function PresentationScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, PRESENTATION_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [router]);

  return <Presentation />;
}

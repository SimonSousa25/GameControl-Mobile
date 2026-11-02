import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState, type AppStateStatus, Platform } from "react-native";

/**
 * Cliente único do TanStack Query. Fica em módulo próprio para que o logout
 * (AuthContext) consiga limpar o cache sem depender de componentes React.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados considerados "frescos" por 1 min: abrir a mesma tela de novo não
      // dispara outra requisição. Cada query pode sobrescrever (ver gameQueries).
      staleTime: 60_000,
      // Mantém em memória por 10 min depois de sair da tela (voltar fica instantâneo).
      gcTime: 10 * 60_000,
      retry: 1,
      retryDelay: 1_000,
    },
  },
});

/**
 * No React Native não existe "foco da janela". Usamos o estado do app: ao voltar
 * do segundo plano, as queries que já estão velhas (stale) são atualizadas.
 */
function aoMudarEstadoDoApp(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

AppState.addEventListener("change", aoMudarEstadoDoApp);

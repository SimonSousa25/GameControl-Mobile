import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

import notificationService from "@/services/notificationService";
import pushNotificationService from "@/services/pushNotificationService";
import { useAuth } from "@/src/contexts/AuthContext";

const POLLING_INTERVAL_MS = 30_000;

interface NotificationsContextValue {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  setUnreadCount: (count: number) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined,
);

pushNotificationService.configurarExibicao();

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [unreadCount, setUnreadCount] = useState(0);
  // Token registrado nesta sessão, para removê-lo no logout.
  const deviceTokenRef = useRef<string | null>(null);

  /** Decide para onde ir ao tocar em um push (a tela de post ainda não existe). */
  const abrirNotificacao = useCallback(
    (data: Record<string, unknown>) => {
      if (data.type === "NEW_FOLLOWER" && typeof data.actorId === "string") {
        router.push(`/user/${data.actorId}`);
        return;
      }
      // POST_LIKED / POST_COMMENTED: quando existir a tela do post, navegar
      // para ela usando data.postId.
      router.push("/notifications");
    },
    [router],
  );

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    try {
      setUnreadCount(await notificationService.contarNaoLidas(userId));
    } catch (error) {
      // Mantém o último valor; o próximo ciclo tenta de novo.
      console.warn(String(error));
    }
  }, [userId]);

  useEffect(() => {
    void refreshUnreadCount();
    if (!userId) return;
    const interval = setInterval(() => void refreshUnreadCount(), POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [userId, refreshUnreadCount]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const registrar = async (token: string) => {
      await notificationService.registrarTokenDoAparelho(userId, token, Platform.OS);
      if (cancelled) {
        // O usuário saiu enquanto registrávamos: desfaz para não deixar o
        // aparelho recebendo pushes da conta antiga.
        notificationService.removerTokenDoAparelho(token).catch(() => {});
        return;
      }
      deviceTokenRef.current = token;
    };

    (async () => {
      try {
        const token = await pushNotificationService.obterTokenDoAparelho();
        if (!token || cancelled) return;
        await registrar(token);
      } catch (error) {
        console.error("Erro ao configurar notificações push:", error);
      }
    })();

    // O FCM pode renovar o token; sem isso o aparelho deixa de receber pushes.
    const pararTrocaDeToken = pushNotificationService.aoTrocarToken((novoToken) => {
      const antigo = deviceTokenRef.current;
      registrar(novoToken)
        .then(() => {
          if (antigo && antigo !== novoToken) {
            notificationService.removerTokenDoAparelho(antigo).catch(() => {});
          }
        })
        .catch((error) => console.warn("Erro ao registrar novo token:", String(error)));
    });

    return () => {
      cancelled = true;
      pararTrocaDeToken();
      const token = deviceTokenRef.current;
      deviceTokenRef.current = null;
      if (token) {
        notificationService.removerTokenDoAparelho(token).catch(() => {});
      }
    };
  }, [userId]);

  useEffect(() => {
    const pararRecebimento = pushNotificationService.aoReceber(() => {
      void refreshUnreadCount();
    });
    const pararToque = pushNotificationService.aoTocar(abrirNotificacao);
    return () => {
      pararRecebimento();
      pararToque();
    };
  }, [abrirNotificacao, refreshUnreadCount]);

  // Push tocado com o app fechado. Só depois de a sessão carregar (userId),
  // senão a tela de notificações redirecionaria para o login.
  const toqueInicialTratado = useRef<string | null>(null);
  useEffect(() => {
    if (!userId) return;
    const toque = pushNotificationService.obterToqueDeAppFechado();
    if (!toque || toqueInicialTratado.current === toque.id) return;
    toqueInicialTratado.current = toque.id;
    abrirNotificacao(toque.data);
  }, [userId, abrirNotificacao]);

  const value = useMemo<NotificationsContextValue>(
    () => ({ unreadCount, refreshUnreadCount, setUnreadCount }),
    [unreadCount, refreshUnreadCount],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications deve ser usado dentro de <NotificationsProvider>.");
  }
  return ctx;
}
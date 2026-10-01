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
    (async () => {
      try {
        const token = await pushNotificationService.obterTokenDoAparelho();
        if (!token || cancelled) return;
        await notificationService.registrarTokenDoAparelho(userId, token, Platform.OS);
        deviceTokenRef.current = token;
      } catch (error) {
        console.error("Erro ao configurar notificações push:", error);
      }
    })();
    return () => {
      cancelled = true;
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
    const pararToque = pushNotificationService.aoTocar((data) => {
      if (data.type === "NEW_FOLLOWER" && typeof data.actorId === "string") {
        router.push(`/user/${data.actorId}`);
        return;
      }
      router.push("/notifications");
    });
    return () => {
      pararRecebimento();
      pararToque();
    };
  }, [router, refreshUnreadCount]);

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

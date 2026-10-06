import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import type * as NotificationsModule from "expo-notifications";

/**
 * O expo-notifications lança erro já no momento do import no Expo Go (Android).
 * Por isso ele só é carregado (require) quando o push é suportado.
 */
let notificationsCache: typeof NotificationsModule | null = null;
function getNotifications(): typeof NotificationsModule {
  if (!notificationsCache) {
    notificationsCache = require("expo-notifications");
  }
  return notificationsCache!;
}

/** Mesmo id usado pelo backend ao enviar pelo FCM. */
const ANDROID_CHANNEL_ID = "default";

/**
 * Push via Firebase Cloud Messaging só funciona em build nativo Android:
 * - no web não há FCM configurado;
 * - no Expo Go o Android não entrega pushes desde o SDK 53;
 * - no iOS o token do aparelho é da Apple (APNs), não do FCM.
 */
function isPushSupported(): boolean {
  return (
    Platform.OS === "android" &&
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient
  );
}

/** Mostra a notificação mesmo com o app aberto. Chamar uma vez na inicialização. */
function configurarExibicao(): void {
  if (!isPushSupported()) return;
  getNotifications().setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Pede permissão e devolve o token FCM do aparelho, ou null quando o push
 * não é suportado ou o usuário negou a permissão.
 */
async function obterTokenDoAparelho(): Promise<string | null> {
  if (!isPushSupported()) return null;

  await getNotifications().setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Notificações",
    importance: getNotifications().AndroidImportance.HIGH,
  });

  const { status: atual } = await getNotifications().getPermissionsAsync();
  const status =
    atual === "granted"
      ? atual
      : (await getNotifications().requestPermissionsAsync()).status;
  if (status !== "granted") return null;

  const { data } = await getNotifications().getDevicePushTokenAsync();
  return typeof data === "string" ? data : null;
}

/** Recebe um push com o app aberto. Retorna a função para cancelar. */
function aoReceber(callback: () => void): () => void {
  if (!isPushSupported()) return () => {};
  const subscription = getNotifications().addNotificationReceivedListener(() => callback());
  return () => subscription.remove();
}

/** Usuário tocou no push. Retorna a função para cancelar. */
function aoTocar(callback: (data: Record<string, unknown>) => void): () => void {
  if (!isPushSupported()) return () => {};
  const subscription = getNotifications().addNotificationResponseReceivedListener(
    (response) => callback(response.notification.request.content.data ?? {}),
  );
  return () => subscription.remove();
}

/**
 * O FCM pode trocar o token do aparelho a qualquer momento. Retorna a função
 * para cancelar.
 */
function aoTrocarToken(callback: (token: string) => void): () => void {
  if (!isPushSupported()) return () => {};
  const subscription = getNotifications().addPushTokenListener((token) => {
    if (typeof token.data === "string") callback(token.data);
  });
  return () => subscription.remove();
}

/**
 * Push tocado com o app fechado: o listener de toque ainda não existia, então
 * o Android guarda a resposta. Devolve o id e os dados uma única vez.
 */
function obterToqueDeAppFechado(): { id: string; data: Record<string, unknown> } | null {
  if (!isPushSupported()) return null;
  const resposta = getNotifications().getLastNotificationResponse();
  if (!resposta) return null;
  getNotifications().clearLastNotificationResponse();
  return {
    id: resposta.notification.request.identifier,
    data: resposta.notification.request.content.data ?? {},
  };
}

export default {
  isPushSupported,
  configurarExibicao,
  obterTokenDoAparelho,
  aoReceber,
  aoTocar,
  aoTrocarToken,
  obterToqueDeAppFechado,
};
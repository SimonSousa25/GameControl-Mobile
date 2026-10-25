import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import FollowRequestItem from "@/components/FollowRequestItem/FollowRequestItem";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { Text, View } from "@/components/Themed";
import { isNotFoundError } from "@/services/apiError";
import notificationService, {
  NotificationDTO,
  NotificationType,
} from "@/services/notificationService";
import userService, { FollowRequestDTO } from "@/services/userService";
import { useNotifications } from "@/src/contexts/NotificationsContext";

import { styles } from "./styles";

interface NotificationsProps {
  userId: string;
  onBackPress?: () => void;
  onActorPress?: (actorId: string) => void;
  onSearchPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

const ICONS: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  NEW_FOLLOWER: "person-add-outline",
  POST_LIKED: "heart-outline",
  POST_COMMENTED: "chatbubble-outline",
  FOLLOW_REQUEST: "person-add-outline",
  FOLLOW_REQUEST_ACCEPTED: "checkmark-circle-outline",
};

function formatarTempo(createdAt: string): string {
  const data = new Date(createdAt);
  if (Number.isNaN(data.getTime())) return "";
  const minutos = Math.floor((Date.now() - data.getTime()) / 60_000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `há ${dias} d`;
  return data.toLocaleDateString("pt-BR");
}

export default function Notifications({
  userId,
  onBackPress,
  onActorPress,
  onSearchPress,
  onTabPress,
}: NotificationsProps) {
  const { setUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  // Pedidos para seguir pendentes (perfil privado), com Aceitar/Recusar.
  const [requests, setRequests] = useState<FollowRequestDTO[]>([]);
  // Quem tem um aceitar/recusar em andamento (evita toque duplo).
  const [busyRequesters, setBusyRequesters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      // Os pedidos vêm direto da API de pedidos (fonte da verdade): assim
      // aparecem mesmo se o usuário desligou a notificação de seguidores.
      const [notificationsResult, requestsResult] = await Promise.allSettled([
        notificationService.listarDoUsuario(userId),
        userService.listarPedidosSeguir(userId),
      ]);
      if (notificationsResult.status === "rejected") {
        throw notificationsResult.reason;
      }
      const data = notificationsResult.value;
      setNotifications(data);
      if (requestsResult.status === "fulfilled") {
        setRequests(requestsResult.value);
      }
      // Abrir a tela conta como "ver" as notificações. A lista local mantém
      // o destaque das não lidas até a próxima vez que a tela for aberta.
      if (data.some((notification) => !notification.read)) {
        await notificationService.marcarTodasComoLidas(userId);
      }
      setUnreadCount(0);
    } catch {
      setError(true);
    }
  }, [userId, setUnreadCount]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const respondToRequest = async (
    request: FollowRequestDTO,
    action: "accept" | "reject",
  ) => {
    const requesterId = request.requesterId;
    if (busyRequesters.includes(requesterId)) return;

    const removeRequest = () =>
      setRequests((prev) =>
        prev.filter((item) => item.requesterId !== requesterId),
      );

    setBusyRequesters((prev) => [...prev, requesterId]);
    try {
      if (action === "accept") {
        await userService.aceitarPedidoSeguir(userId, requesterId);
      } else {
        await userService.recusarPedidoSeguir(userId, requesterId);
      }
      removeRequest();
    } catch (error) {
      if (isNotFoundError(error)) {
        // O pedido foi cancelado por quem enviou (ou já respondido).
        removeRequest();
        Alert.alert(
          "Pedido indisponível",
          "Este pedido foi cancelado ou já foi respondido.",
        );
      } else {
        Alert.alert(
          action === "accept"
            ? "Não foi possível aceitar"
            : "Não foi possível recusar",
          "Tente novamente em instantes.",
        );
      }
    } finally {
      setBusyRequesters((prev) => prev.filter((id) => id !== requesterId));
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            Não foi possível carregar suas notificações.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // FOLLOW_REQUEST já aparece (com botões) na seção de pedidos.
    const visibleNotifications = notifications.filter(
      (notification) => notification.type !== "FOLLOW_REQUEST",
    );

    if (visibleNotifications.length === 0 && requests.length === 0) {
      return (
        <View style={styles.stateContainer}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="notifications-off-outline" size={26} color="#6B7280" />
          </View>
          <Text style={styles.stateText}>Nenhuma notificação por aqui.</Text>
        </View>
      );
    }

    const requestsSection =
      requests.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Pedidos para seguir ({requests.length})
          </Text>
          {requests.map((request) => (
            <FollowRequestItem
              key={request.requesterId}
              request={request}
              timeLabel={formatarTempo(request.createdAt ?? "")}
              busy={busyRequesters.includes(request.requesterId)}
              onAccept={() => void respondToRequest(request, "accept")}
              onReject={() => void respondToRequest(request, "reject")}
              onProfilePress={() => onActorPress?.(request.requesterId)}
            />
          ))}
        </View>
      ) : null;

    const notificationItems = visibleNotifications.map((notification) => (
      <TouchableOpacity
        key={notification.id}
        style={[styles.item, !notification.read && styles.itemUnread]}
        activeOpacity={0.8}
        onPress={() => onActorPress?.(notification.actorId)}
      >
        <View style={styles.itemIcon}>
          <Ionicons
            name={ICONS[notification.type] ?? "notifications-outline"}
            size={18}
            color="#F43B97"
          />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemMessage}>
            {notification.actorUsername &&
            notification.message.startsWith(notification.actorUsername) ? (
              <>
                <Text style={styles.itemActor}>{notification.actorUsername}</Text>
                {notification.message.slice(notification.actorUsername.length)}
              </>
            ) : (
              notification.message
            )}
          </Text>
          <Text style={styles.itemTime}>
            {formatarTempo(notification.createdAt)}
          </Text>
        </View>
        {!notification.read ? <View style={styles.unreadDot} /> : null}
      </TouchableOpacity>
    ));

    return (
      <>
        {requestsSection}
        {notificationItems}
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Header onSearchPress={onSearchPress} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#F52E8F"
          />
        }
      >
        <View style={styles.titleRow}>
          {onBackPress ? <BackButton onPress={onBackPress} /> : null}
          <View style={styles.titleText}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>
              Acompanhe o que acontece no seu perfil
            </Text>
          </View>
        </View>

        {renderContent()}
      </ScrollView>

      <NavBottom activeTab={null} onTabPress={onTabPress} />
    </View>
  );
}
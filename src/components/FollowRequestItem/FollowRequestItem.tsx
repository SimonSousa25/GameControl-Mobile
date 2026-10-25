import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import type { FollowRequestDTO } from "@/services/userService";
import { getAvatarUrl } from "@/utils/avatar";

import { styles } from "./styles";

export interface FollowRequestItemProps {
  request: FollowRequestDTO;
  /** Texto de tempo já formatado (ex.: "há 5 min"). */
  timeLabel?: string;
  /** true enquanto aceitar/recusar está em andamento (desabilita os botões). */
  busy?: boolean;
  onAccept: () => void;
  onReject: () => void;
  /** Toque na foto/nome: abre o perfil de quem pediu. */
  onProfilePress?: () => void;
}

/** Cartão de um pedido para seguir, com os botões Aceitar e Recusar. */
export function FollowRequestItem({
  request,
  timeLabel,
  busy = false,
  onAccept,
  onReject,
  onProfilePress,
}: FollowRequestItemProps) {
  const avatarUrl = getAvatarUrl(request.requesterProfilePictureUrl);
  const username = request.requesterUsername ?? "Alguém";

  return (
    <View style={styles.card}>
      <TouchableOpacity
        accessibilityLabel={`Abrir perfil de ${username}`}
        accessibilityRole="button"
        style={styles.profileRow}
        activeOpacity={0.8}
        onPress={onProfilePress}
        disabled={!onProfilePress}
      >
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-outline" size={20} color="#00E5FF" />
          )}
        </View>

        <View style={styles.info} lightColor="transparent" darkColor="transparent">
          <Text style={styles.message} numberOfLines={2}>
            <Text style={styles.username}>{username}</Text> quer seguir você.
          </Text>
          {timeLabel ? <Text style={styles.time}>{timeLabel}</Text> : null}
        </View>
      </TouchableOpacity>

      <View style={styles.actions} lightColor="transparent" darkColor="transparent">
        <TouchableOpacity
          accessibilityLabel={`Recusar pedido de ${username}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: busy }}
          style={[styles.button, styles.rejectButton, busy && styles.disabled]}
          activeOpacity={0.8}
          disabled={busy}
          onPress={onReject}
        >
          <Text style={styles.rejectText}>Recusar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`Aceitar pedido de ${username}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: busy, busy }}
          style={[styles.button, styles.acceptButton, busy && styles.disabled]}
          activeOpacity={0.8}
          disabled={busy}
          onPress={onAccept}
        >
          {busy ? (
            <ActivityIndicator size="small" color="#F5F7FF" />
          ) : (
            <Text style={styles.acceptText}>Aceitar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FollowRequestItem;

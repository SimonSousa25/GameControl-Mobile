import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Text } from "@/components/Themed";

import { styles } from "./styles";

export interface FollowButtonProps {
  /** true quando o usuário visualizador já segue o perfil. */
  following: boolean;
  /** true quando há um pedido para seguir pendente (perfil privado). */
  requested?: boolean;
  /**
   * Segundos que faltam para poder pedir de novo depois de uma recusa.
   * Maior que 0 desabilita o botão.
   */
  cooldownSeconds?: number;
  /** true enquanto a requisição de seguir/deixar de seguir está em andamento. */
  loading?: boolean;
  onPress?: () => void;
}

type Variant = "follow" | "following" | "requested" | "cooldown";

const CONFIG: Record<
  Variant,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  follow: { icon: "add", color: "#F5F7FF" },
  following: { icon: "checkmark", color: "#00E5FF" },
  requested: { icon: "time-outline", color: "#AAB2C0" },
  cooldown: { icon: "hourglass-outline", color: "#6B7280" },
};

/**
 * Botão de relacionamento: "Seguir" (RF11), "Seguindo" (RF11.02), "Solicitado"
 * (perfil privado aguardando aprovação; tocar cancela o pedido) ou "Aguarde"
 * (pedido recusado há pouco).
 */
export function FollowButton({
  following,
  requested = false,
  cooldownSeconds = 0,
  loading = false,
  onPress,
}: FollowButtonProps) {
  const inCooldown = !following && !requested && cooldownSeconds > 0;
  const variant: Variant = following
    ? "following"
    : requested
      ? "requested"
      : inCooldown
        ? "cooldown"
        : "follow";

  const { icon, color } = CONFIG[variant];

  const label = {
    follow: "Seguir",
    following: "Seguindo",
    requested: "Solicitado",
    cooldown: `Aguarde ${cooldownSeconds}s`,
  }[variant];

  const accessibilityLabel = {
    follow: "Seguir usuário",
    following: "Deixar de seguir",
    requested: "Cancelar pedido para seguir",
    cooldown: `Você poderá pedir para seguir de novo em ${cooldownSeconds} segundos`,
  }[variant];

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        selected: following || requested,
        busy: loading,
        disabled: loading || inCooldown,
      }}
      style={[
        styles.button,
        variant === "follow" && styles.buttonFollow,
        variant === "following" && styles.buttonFollowing,
        variant === "requested" && styles.buttonRequested,
        variant === "cooldown" && styles.buttonCooldown,
      ]}
      activeOpacity={0.8}
      disabled={loading || inCooldown}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          <Ionicons name={icon} size={13} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default FollowButton;

import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Text } from "@/components/Themed";

import { styles } from "./styles";

export interface FollowButtonProps {
  /** true quando o usuário visualizador já segue o perfil. */
  following: boolean;
  /** true enquanto a requisição de seguir/deixar de seguir está em andamento. */
  loading?: boolean;
  onPress?: () => void;
}

/** Botão de relacionamento: "Seguir" (RF11) ou "Seguindo" (RF11.02). */
export function FollowButton({
  following,
  loading = false,
  onPress,
}: FollowButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={following ? "Deixar de seguir" : "Seguir usuário"}
      accessibilityRole="button"
      accessibilityState={{ selected: following, busy: loading }}
      style={[styles.button, following ? styles.buttonFollowing : styles.buttonFollow]}
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={following ? "#00E5FF" : "#F5F7FF"} />
      ) : (
        <>
          <Ionicons
            name={following ? "checkmark" : "add"}
            size={13}
            color={following ? "#00E5FF" : "#F5F7FF"}
          />
          <Text style={[styles.label, following && styles.labelFollowing]}>
            {following ? "Seguindo" : "Seguir"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default FollowButton;

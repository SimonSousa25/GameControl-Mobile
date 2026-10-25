import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface PrivateProfileNoticeProps {
  /** true quando o visualizador já pediu para seguir e aguarda aprovação. */
  requested?: boolean;
}

/**
 * Aviso exibido no lugar dos posts e playlists de um perfil privado para quem
 * ainda não segue. Foto, nome e contadores continuam visíveis no cabeçalho.
 */
export function PrivateProfileNotice({
  requested = false,
}: PrivateProfileNoticeProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="lock-closed-outline" size={24} color="#F52E8F" />
      </View>

      <Text style={styles.title}>Esta conta é privada</Text>
      <Text style={styles.text}>
        {requested
          ? "Seu pedido foi enviado. Quando o jogador aprovar, você poderá ver os posts e as playlists dele."
          : "Siga este jogador para ver os posts e as playlists dele. Ele precisará aprovar o seu pedido."}
      </Text>
    </View>
  );
}

export default PrivateProfileNotice;

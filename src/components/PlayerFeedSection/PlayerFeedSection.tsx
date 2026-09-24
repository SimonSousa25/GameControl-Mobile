import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface PlayerFeedSectionProps {
  onExpandPress?: () => void;
}

/**
 * Seção "Feed do jogador" (RF10.03 a RF10.10).
 *
 * TODO: implementar o feed de fato (campo de nova publicação com contador de
 * caracteres, lista de posts, curtir, comentários e exclusão). Por enquanto a
 * seção é apenas um placeholder visual e o botão de expandir não faz nada.
 */
export function PlayerFeedSection({ onExpandPress }: PlayerFeedSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow} lightColor="transparent" darkColor="transparent">
        <View style={styles.headerLeft} lightColor="transparent" darkColor="transparent">
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#F52E8F" />
          </View>
          <View lightColor="transparent" darkColor="transparent">
            <Text style={styles.title}>Feed do jogador</Text>
            <Text style={styles.subtitle}>Posts dos usuários que você segue</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel="Abrir feed completo"
          accessibilityRole="button"
          style={styles.expandButton}
          activeOpacity={0.7}
          onPress={onExpandPress}
          hitSlop={8}
        >
          <Ionicons name="open-outline" size={16} color="#758096" />
        </TouchableOpacity>
      </View>

      <View style={styles.placeholderBox}>
        <Ionicons name="hourglass-outline" size={22} color="#334056" />
        <Text style={styles.placeholderTitle}>Em breve</Text>
        <Text style={styles.placeholderText}>
          O feed do jogador chegará em uma atualização futura.
        </Text>
      </View>
    </View>
  );
}

export default PlayerFeedSection;

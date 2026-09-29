import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";
import { styles } from "./styles";

export function UserPostsSection() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow} lightColor="transparent" darkColor="transparent">
        <View style={styles.iconCircle}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#F52E8F" />
        </View>
        <View lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>Posts</Text>
          <Text style={styles.subtitle}>Publicações deste jogador</Text>
        </View>
      </View>

      <View style={styles.placeholderBox}>
        <Ionicons name="hourglass-outline" size={22} color="#334056" />
        <Text style={styles.placeholderTitle}>Em breve</Text>
        <Text style={styles.placeholderText}>
          As publicações chegarão em uma atualização futura.
        </Text>
      </View>
    </View>
  );
}

export default UserPostsSection;

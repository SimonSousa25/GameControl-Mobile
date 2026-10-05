import { Text, View } from "@/components/Themed";
import userService, { UserDTO } from "@/services/userService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import PlayerCard from "@/components/PlayerCard/PlayerCard";
import { styles } from "./styles";

interface PlayersHighlightProps {
  onUserPress?: (userId: string) => void;
  onViewAllPress?: () => void;
}

export default function PlayersHighlight({
  onUserPress,
  onViewAllPress,
}: PlayersHighlightProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.listarUsuarios();
      setUsers(data.slice(0, 5)); // Limitar a 5 usuários
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container} lightColor="transparent" darkColor="transparent">
        <View style={styles.header} lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>Jogadores em Destaque</Text>
        </View>
        <View style={styles.loadingContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} lightColor="transparent" darkColor="transparent">
      <View style={styles.header} lightColor="transparent" darkColor="transparent">
        <LinearGradient
          colors={["#0559AB", "#F22E8F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>Jogadores em Destaque</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAll}>Ver tudo →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
      >
        {users.map((user, index) => (
          <PlayerCard
            key={user.id}
            user={user}
            colorIndex={index}
            onPress={onUserPress}
            style={styles.cardSpacing}
          />
        ))}
      </ScrollView>
    </View>
  );
}
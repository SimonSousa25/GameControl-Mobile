import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text, View } from "@/components/Themed";
import type { UserDTO } from "@/services/userService";

import { styles } from "./styles";

interface PlayerCardProps {
  user: UserDTO;
  /** Define a cor do avatar gerado quando o usuário não tem foto. */
  colorIndex: number;
  onPress?: (userId: string) => void;
  style?: StyleProp<ViewStyle>;
}

export default function PlayerCard({ user, colorIndex, onPress, style }: PlayerCardProps) {
  return (
    <LinearGradient
      colors={["#33121F", "#060814"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardGradient, style]}
    >
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => onPress?.(user.id)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          {user.profilePictureUrl ? (
            <Image source={{ uri: user.profilePictureUrl }} style={styles.avatar} />
          ) : (
            <AvatarGradient
              initial={user.username.charAt(0).toUpperCase()}
              colorIndex={colorIndex}
            />
          )}
        </View>
        <Text style={styles.username} numberOfLines={2}>
          {user.username}
        </Text>
        <TouchableOpacity style={styles.followButton} onPress={() => onPress?.(user.id)}>
          <Text style={styles.followButtonText}>Seguir</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </LinearGradient>
  );
}

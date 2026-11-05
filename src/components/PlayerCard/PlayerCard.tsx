import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text, View } from "@/components/Themed";
import type { UserDTO } from "@/services/userService";

import { styles } from "./styles";

interface PlayerCardProps {
  user: UserDTO;
  colorIndex: number;
  onPress?: (userId: string) => void;
  style?: StyleProp<ViewStyle>;

  size?: "default" | "large";
}

const LARGE_AVATAR_SIZE = 52;

/** A bio ocupa sempre o mesmo espaço, para os cards de uma fileira ficarem do mesmo tamanho. */
export const BIO_MAX_LINES = 4;
export const EMPTY_BIO_TEXT = "Sem descrição";

export default function PlayerCard({
  user,
  colorIndex,
  onPress,
  style,
  size = "default",
}: PlayerCardProps) {
  const large = size === "large";
  // Quebras de linha e espaços repetidos gastariam as linhas do card à toa.
  const bio = user.bio?.replace(/\s+/g, " ").trim();

  return (
    <LinearGradient
      colors={["#33121F", "#060814"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardGradient, style]}
    >
      <TouchableOpacity
        style={[styles.userCard, large && styles.userCardLarge]}
        onPress={() => onPress?.(user.id)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Ver perfil de ${user.username}`}
      >
        <View style={[styles.avatarContainer, large && styles.avatarContainerLarge]}>
          {user.profilePictureUrl ? (
            <Image
              source={{ uri: user.profilePictureUrl }}
              style={[styles.avatar, large && styles.avatarLarge]}
            />
          ) : (
            <AvatarGradient
              initial={user.username.charAt(0).toUpperCase()}
              colorIndex={colorIndex}
              size={large ? LARGE_AVATAR_SIZE : undefined}
            />
          )}
        </View>
        <Text
          style={[styles.username, large && styles.usernameLarge]}
          numberOfLines={2}
        >
          {user.username}
        </Text>
        <Text
          style={[styles.bio, large && styles.bioLarge, !bio && styles.bioEmpty]}
          numberOfLines={BIO_MAX_LINES}
          ellipsizeMode="tail"
        >
          {bio || EMPTY_BIO_TEXT}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

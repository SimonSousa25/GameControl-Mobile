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

export default function PlayerCard({
  user,
  colorIndex,
  onPress,
  style,
  size = "default",
}: PlayerCardProps) {
  const large = size === "large";

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
        <TouchableOpacity
          style={[styles.followButton, large && styles.followButtonLarge]}
          onPress={() => onPress?.(user.id)}
        >
          <Text style={[styles.followButtonText, large && styles.followButtonTextLarge]}>
            Seguir
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </LinearGradient>
  );
}

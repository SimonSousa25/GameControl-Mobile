import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import type { UserDTO } from "@/services/userService";

import { styles } from "./styles";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// A foto pode vir como data URI (base64), URL completa ou nome de arquivo.
function getAvatarUrl(picture?: string): string | undefined {
  if (!picture) return undefined;
  if (/^(https?:|data:)/.test(picture)) return picture;
  return `${UPLOADS_BASE_URL}/uploads/${picture}`;
}

export interface ProfileHeaderCardProps {
  user?: UserDTO;
  playlistsCount: number;
  onSettingsPress?: () => void;
}

export function ProfileHeaderCard({
  user,
  playlistsCount,
  onSettingsPress,
}: ProfileHeaderCardProps) {
  const avatarUrl = getAvatarUrl(user?.profilePictureUrl);
  const username = user?.username ?? "Jogador";

  // O backend guarda arrays de ids; aceita também contadores prontos.
  const followers = user?.followersCount ?? user?.followers?.length ?? 0;
  const following = user?.followingCount ?? user?.following?.length ?? 0;

  const stats = [
    { label: "Seguidores", value: followers },
    { label: "Seguindo", value: following },
    { label: "Playlists", value: playlistsCount },
  ];

  return (
    <View style={styles.card}>
      <TouchableOpacity
        accessibilityLabel="Configurações do perfil"
        accessibilityRole="button"
        style={styles.settingsButton}
        activeOpacity={0.7}
        onPress={onSettingsPress}
        hitSlop={8}
      >
        <Ionicons name="settings-outline" size={16} color="#00E5FF" />
      </TouchableOpacity>

      <View style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person-outline" size={40} color="#00E5FF" />
        )}
      </View>

      <Text style={styles.username} numberOfLines={1}>
        {username}
      </Text>
      {user?.username ? (
        <Text style={styles.handle} numberOfLines={1}>
          @{user.username.toLowerCase()}
        </Text>
      ) : null}

      {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      {user?.country ? (
        <View
          style={styles.locationRow}
          lightColor="transparent"
          darkColor="transparent"
        >
          <Ionicons name="location-outline" size={12} color="#758096" />
          <Text style={styles.locationText}>{user.country}</Text>
        </View>
      ) : null}

      <View style={styles.statsRow} lightColor="transparent" darkColor="transparent">
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            style={[styles.statItem, index > 0 && styles.statItemDivider]}
            lightColor="transparent"
            darkColor="transparent"
          >
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ProfileHeaderCard;

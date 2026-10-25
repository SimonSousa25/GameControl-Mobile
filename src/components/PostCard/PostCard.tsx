import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text } from "@/components/Themed";
import { UserPostDTO } from "@/services/userPostService";
import { getAvatarUrl } from "@/utils/avatar";

import { styles } from "./styles";

export interface PostCardProps {
  post: UserPostDTO;
  colorIndex: number;
  likedByMe: boolean;
  isOwnPost?: boolean;
  /** Versão menor para grades (ex.: feed da home): texto truncado e data curta. */
  compact?: boolean;
  onLikePress?: () => void;
  onUserPress?: () => void;
  onCommentsPress?: () => void;
}

function formatShortDate(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function formatPostDate(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const date = parsed.toLocaleDateString("pt-BR");
  const time = parsed.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} - ${time}`;
}

export default function PostCard({
  post,
  colorIndex,
  likedByMe,
  isOwnPost,
  compact = false,
  onLikePress,
  onUserPress,
  onCommentsPress,
}: PostCardProps) {
  const avatarUrl = getAvatarUrl(post.profilePictureUrl);
  const commentsCount = post.commentIds?.length ?? 0;
  const likesCount = post.likesCount ?? post.likedUserIds?.length ?? 0;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={onUserPress ? 0.7 : 1}
        disabled={!onUserPress}
        onPress={onUserPress}
      >
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <AvatarGradient
              initial={(post.username || "?").charAt(0).toUpperCase()}
              colorIndex={colorIndex}
            />
          )}
        </View>
        <View style={styles.usernameRow}>
          <Text style={styles.username} numberOfLines={1}>
            {post.username}
          </Text>
          {isOwnPost && (
            <View style={styles.ownBadge}>
              <Text style={styles.ownBadgeText}>VOCÊ</Text>
            </View>
          )}
        </View>
        {compact ? null : (
          <Text style={styles.date}>{formatPostDate(post.createdAt)}</Text>
        )}
      </TouchableOpacity>

      <Text
        style={[styles.content, compact && styles.contentCompact]}
        numberOfLines={compact ? 3 : undefined}
      >
        {post.text}
      </Text>

      <View style={[styles.footer, compact && styles.footerCompact]}>
        <TouchableOpacity
          accessibilityLabel="Ver comentários"
          accessibilityRole="button"
          style={styles.footerItem}
          activeOpacity={0.7}
          onPress={onCommentsPress}
          disabled={!onCommentsPress}
          hitSlop={6}
        >
          <Ionicons name="chatbubble-outline" size={15} color="#6B7280" />
          <Text style={styles.footerText}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={likedByMe ? "Descurtir post" : "Curtir post"}
          accessibilityRole="button"
          style={styles.footerItem}
          activeOpacity={0.7}
          onPress={onLikePress}
          disabled={!onLikePress}
          hitSlop={6}
        >
          <Ionicons
            name={likedByMe ? "heart" : "heart-outline"}
            size={15}
            color={likedByMe ? "#F52E8F" : "#6B7280"}
          />
          <Text style={[styles.footerText, likedByMe && styles.footerTextActive]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        {compact ? (
          <Text style={[styles.date, styles.dateCompact]}>
            {formatShortDate(post.createdAt)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

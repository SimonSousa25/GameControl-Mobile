import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, TouchableOpacity, View } from "react-native";
import { ScaledTextInput as TextInput } from "@/components/ScaledText/ScaledText";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text } from "@/components/Themed";
import { useFontScale } from "@/src/contexts/FontScaleContext";
import { UserPostDTO } from "@/services/userPostService";
import { getAvatarUrl } from "@/utils/avatar";

import { COMPACT_MIN_HEIGHT, styles } from "./styles";

const MAX_LENGTH = 280;

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
  onDeletePress?: () => void;
  onEditSubmit?: (newText: string) => Promise<void> | void;
}

function formatShortDate(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
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
  onDeletePress,
  onEditSubmit,
}: PostCardProps) {
  const { fontScale } = useFontScale();
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text ?? "");
  const [savingEdit, setSavingEdit] = useState(false);
  const avatarUrl = getAvatarUrl(post.profilePictureUrl);
  const commentsCount = post.commentIds?.length ?? 0;
  const likesCount = post.likesCount ?? post.likedUserIds?.length ?? 0;

  const handleCardAction = (action?: () => void) => {
    setMenuVisible(false);
    setDeleteHovered(false);
    action?.();
  };

  const startEditing = () => {
    setMenuVisible(false);
    setDeleteHovered(false);
    setEditHovered(false);
    setEditText(post.text ?? "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditText(post.text ?? "");
  };

  const handleSaveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || savingEdit) return;
    try {
      setSavingEdit(true);
      await onEditSubmit?.(trimmed);
      setIsEditing(false);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <View style={[styles.cardLayout, compact && styles.cardLayoutCompact]}>
      <View
        style={[
          styles.card,
          compact && styles.cardCompact,
          compact && { minHeight: COMPACT_MIN_HEIGHT * fontScale },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.header}
            activeOpacity={onUserPress ? 0.7 : 1}
            disabled={!onUserPress}
            onPress={() => handleCardAction(onUserPress)}
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

          {isOwnPost && (onDeletePress || onEditSubmit) && !isEditing && (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                accessibilityLabel="Opções do post"
                accessibilityRole="button"
                style={styles.menuButton}
                activeOpacity={0.7}
                onPress={() => {
                  setDeleteHovered(false);
                  setEditHovered(false);
                  setMenuVisible((current) => !current);
                }}
                hitSlop={6}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {menuVisible && (onDeletePress || onEditSubmit) && (
          <View style={styles.actionMenu}>
            {onEditSubmit && (
              <Pressable
                accessibilityLabel="Editar post"
                accessibilityRole="button"
                onHoverIn={() => setEditHovered(true)}
                onHoverOut={() => setEditHovered(false)}
                onPress={startEditing}
                style={({ pressed }) => [
                  styles.actionMenuItem,
                  (editHovered || pressed) && styles.actionMenuItemActive,
                ]}
              >
                <Ionicons
                  name="pencil-outline"
                  size={15}
                  color={editHovered ? "#F5F7FF" : "#CBD2DF"}
                />
                <Text
                  style={[
                    styles.actionMenuText,
                    editHovered && styles.actionMenuTextActive,
                  ]}
                >
                  Editar
                </Text>
              </Pressable>
            )}
            {onDeletePress && (
              <Pressable
                accessibilityLabel="Excluir post"
                accessibilityRole="button"
                onHoverIn={() => setDeleteHovered(true)}
                onHoverOut={() => setDeleteHovered(false)}
                onPress={() => {
                  setDeleteHovered(false);
                  setMenuVisible(false);
                  onDeletePress();
                }}
                style={({ pressed }) => [
                  styles.actionMenuItem,
                  (deleteHovered || pressed) && styles.actionMenuItemActive,
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={15}
                  color={deleteHovered ? "#FFD5DC" : "#CBD2DF"}
                />
                <Text
                  style={[
                    styles.actionMenuText,
                    deleteHovered && styles.actionMenuTextActive,
                  ]}
                >
                  Excluir
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={(value) => setEditText(value.slice(0, MAX_LENGTH))}
              placeholderTextColor="#5C6478"
              multiline
              maxLength={MAX_LENGTH}
              autoFocus
            />
            <View style={styles.editActionsRow}>
              <Text style={styles.editCounter}>
                {editText.length}/{MAX_LENGTH}
              </Text>
              <View style={styles.editButtonsRow}>
                <TouchableOpacity
                  accessibilityLabel="Cancelar edição"
                  accessibilityRole="button"
                  style={styles.editCancelButton}
                  activeOpacity={0.8}
                  disabled={savingEdit}
                  onPress={cancelEditing}
                >
                  <Text style={styles.editCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Salvar edição"
                  accessibilityRole="button"
                  style={[
                    styles.editSaveButton,
                    (!editText.trim() || savingEdit) && styles.editSaveButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                  disabled={!editText.trim() || savingEdit}
                  onPress={handleSaveEdit}
                >
                  {savingEdit ? (
                    <ActivityIndicator size="small" color="#F5F7FF" />
                  ) : (
                    <Text style={styles.editSaveButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Text
            style={[
              styles.content,
              compact && styles.contentCompact,
              menuVisible && styles.contentMenuOpen,
            ]}
            numberOfLines={compact ? 3 : undefined}
          >
            {post.text}
            {post.edited && <Text style={styles.editedTag}> (editado)</Text>}
          </Text>
        )}

        <View style={[styles.footer, compact && styles.footerCompact]}>
          <TouchableOpacity
            accessibilityLabel="Ver comentários"
            accessibilityRole="button"
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={() => handleCardAction(onCommentsPress)}
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
            onPress={() => handleCardAction(onLikePress)}
            disabled={!onLikePress}
            hitSlop={6}
          >
            <Ionicons
              name={likedByMe ? "heart" : "heart-outline"}
              size={15}
              color={likedByMe ? "#F52E8F" : "#6B7280"}
            />
            <Text
              style={[styles.footerText, likedByMe && styles.footerTextActive]}
            >
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
    </View>
  );
}

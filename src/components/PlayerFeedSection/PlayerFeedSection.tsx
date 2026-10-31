import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import PostCard from "@/components/PostCard/PostCard";
import PostComposer from "@/components/PostComposer/PostComposer";
import { Text, View } from "@/components/Themed";
import userPostService, { UserPostDTO } from "@/services/userPostService";

import { styles } from "./styles";

export interface PlayerFeedSectionProps {
  userId: string;
  onExpandPress?: () => void;
  onUserPress?: (userId: string) => void;
}

function sortByDateDesc(posts: UserPostDTO[]): UserPostDTO[] {
  return [...posts].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export function PlayerFeedSection({
  userId,
  onExpandPress,
  onUserPress,
}: PlayerFeedSectionProps) {
  const [posts, setPosts] = useState<UserPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await userPostService.listarPostsDoUsuario(userId);
      setPosts(sortByDateDesc(data));
    } catch (error) {
      console.error("Erro ao carregar posts do jogador:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (text: string) => {
    const created = await userPostService.criarPost({ userId, text });
    setPosts((prev) => [created, ...prev]);
  };

  const handleToggleLike = async (post: UserPostDTO) => {
    if (!post.id) return;
    const alreadyLiked = post.likedUserIds?.includes(userId) ?? false;

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedUserIds: alreadyLiked
                ? (item.likedUserIds ?? []).filter((id) => id !== userId)
                : [...(item.likedUserIds ?? []), userId],
              likesCount: (item.likesCount ?? 0) + (alreadyLiked ? -1 : 1),
            }
          : item,
      ),
    );

    try {
      await userPostService.alternarCurtida(post.id);
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      loadPosts();
    }
  };

  const handleCommentAdded = (postId: string, commentId?: string) => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              commentIds: [...(item.commentIds ?? []), commentId ?? ""],
            }
          : item,
      ),
    );
  };

  const handleCommentDeleted = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              commentIds: (item.commentIds ?? []).filter(
                (id) => id !== commentId,
              ),
            }
          : item,
      ),
    );
  };

  const handleDeletePost = async (post: UserPostDTO) => {
    if (!post.id) return;

    try {
      await userPostService.deletarPost(post.id);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow} lightColor="transparent" darkColor="transparent">
        <View style={styles.headerLeft} lightColor="transparent" darkColor="transparent">
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#F52E8F" />
          </View>
          <View lightColor="transparent" darkColor="transparent">
            <Text style={styles.title}>Feed do jogador</Text>
            <Text style={styles.subtitle}>Suas publicações</Text>
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

      <PostComposer onSubmit={handleSubmitPost} />

      {loading ? (
        <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="small" color="#F52E8F" />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.placeholderBox}>
          <Ionicons name="chatbubble-outline" size={22} color="#334056" />
          <Text style={styles.placeholderTitle}>Nenhum post ainda</Text>
          <Text style={styles.placeholderText}>
            Compartilhe o que está rolando no seu universo gamer!
          </Text>
        </View>
      ) : (
        posts.map((post, index) => (
          <PostCard
            key={post.id ?? index}
            post={post}
            colorIndex={index}
            likedByMe={post.likedUserIds?.includes(userId) ?? false}
            isOwnPost
            onLikePress={() => handleToggleLike(post)}
            onUserPress={post.userId ? () => onUserPress?.(post.userId!) : undefined}
            onCommentsPress={post.id ? () => setCommentsPostId(post.id!) : undefined}
            onDeletePress={() => handleDeletePost(post)}
          />
        ))
      )}

      <PostCommentsModal
        visible={commentsPostId !== null}
        postId={commentsPostId}
        userId={userId}
        onClose={() => setCommentsPostId(null)}
        onCommentAdded={(commentId) =>
          commentsPostId && handleCommentAdded(commentsPostId, commentId)
        }
        onCommentDeleted={(commentId) =>
          commentsPostId && handleCommentDeleted(commentsPostId, commentId)
        }
      />
    </View>
  );
}

export default PlayerFeedSection;

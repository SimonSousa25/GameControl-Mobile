import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import PostCard from "@/components/PostCard/PostCard";
import { Text, View } from "@/components/Themed";
import userPostService, { UserPostDTO } from "@/services/userPostService";

import { styles } from "./styles";

export interface UserPostsSectionProps {
  userId: string;
  viewerId?: string;
}

function sortByDateDesc(posts: UserPostDTO[]): UserPostDTO[] {
  return [...posts].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export function UserPostsSection({ userId, viewerId }: UserPostsSectionProps) {
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
      console.error("Erro ao carregar posts do usuário:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (post: UserPostDTO) => {
    if (!post.id || !viewerId) return;
    const alreadyLiked = post.likedUserIds?.includes(viewerId) ?? false;

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedUserIds: alreadyLiked
                ? (item.likedUserIds ?? []).filter((id) => id !== viewerId)
                : [...(item.likedUserIds ?? []), viewerId],
              likesCount: (item.likesCount ?? 0) + (alreadyLiked ? -1 : 1),
            }
          : item,
      ),
    );

    try {
      await userPostService.alternarCurtida(post.id, viewerId);
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

      {loading ? (
        <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="small" color="#F52E8F" />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.placeholderBox}>
          <Ionicons name="hourglass-outline" size={22} color="#334056" />
          <Text style={styles.placeholderTitle}>Nenhum post ainda</Text>
          <Text style={styles.placeholderText}>
            Esse jogador ainda não publicou nada.
          </Text>
        </View>
      ) : (
        posts.map((post, index) => (
          <PostCard
            key={post.id ?? index}
            post={post}
            colorIndex={index}
            likedByMe={viewerId ? post.likedUserIds?.includes(viewerId) ?? false : false}
            onLikePress={viewerId ? () => handleToggleLike(post) : undefined}
            onCommentsPress={
              viewerId && post.id ? () => setCommentsPostId(post.id!) : undefined
            }
          />
        ))
      )}

      {viewerId && (
        <PostCommentsModal
          visible={commentsPostId !== null}
          postId={commentsPostId}
          userId={viewerId}
          onClose={() => setCommentsPostId(null)}
          onCommentAdded={(commentId) =>
            commentsPostId && handleCommentAdded(commentsPostId, commentId)
          }
        />
      )}
    </View>
  );
}

export default UserPostsSection;

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import PostCard from "@/components/PostCard/PostCard";
import { Text, View } from "@/components/Themed";
import userPostService, { UserPostDTO } from "@/services/userPostService";
import userService from "@/services/userService";

import { styles } from "./styles";

const MAX_POSTS = 4;

export interface HomeFeedSectionProps {
  userId: string;
  onViewAllPress?: () => void;
  onUserPress?: (userId: string) => void;
}

export function HomeFeedSection({
  userId,
  onViewAllPress,
  onUserPress,
}: HomeFeedSectionProps) {
  const [posts, setPosts] = useState<UserPostDTO[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  useEffect(() => {
    loadFeed();
  }, [userId]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const [freshUser, allPosts] = await Promise.all([
        userService.buscarUsuarioPorId(userId),
        userPostService.listarTodosPosts(),
      ]);
      setFollowing(freshUser.following ?? []);
      setPosts(allPosts);
    } catch (error) {
      console.error("Erro ao carregar o feed da home:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const feedPosts = useMemo(() => {
    const visibleIds = new Set([...following, userId]);
    return posts
      .filter((post) => post.userId && visibleIds.has(post.userId))
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, MAX_POSTS);
  }, [posts, following, userId]);

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
      await userPostService.alternarCurtida(post.id, userId);
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      loadFeed();
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

  if (!loading && feedPosts.length === 0) {
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
        <Text style={styles.title}>Feed Geral</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAll}>Ver tudo →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      ) : (
        feedPosts.map((post, index) => (
          <PostCard
            key={post.id ?? index}
            post={post}
            colorIndex={index}
            likedByMe={post.likedUserIds?.includes(userId) ?? false}
            isOwnPost={post.userId === userId}
            onLikePress={() => handleToggleLike(post)}
            onUserPress={post.userId ? () => onUserPress?.(post.userId!) : undefined}
            onCommentsPress={post.id ? () => setCommentsPostId(post.id!) : undefined}
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
      />
    </View>
  );
}

export default HomeFeedSection;

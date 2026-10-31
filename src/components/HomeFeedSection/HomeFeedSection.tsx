import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";

import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import PostCard from "@/components/PostCard/PostCard";
import { Text, View } from "@/components/Themed";
import userPostService, { UserPostDTO } from "@/services/userPostService";
import userService from "@/services/userService";

import { styles, COLUMN_WIDTH, COLUMN_GAP } from "./styles";

/** 3 colunas x 2 linhas. */
const MAX_POSTS = 6;
const POSTS_PER_COLUMN = 2;

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

  // Só quem o usuário segue: os próprios posts ficam de fora (já estão no perfil).
  const feedPosts = useMemo(() => {
    const followedIds = new Set(following);
    return posts
      .filter(
        (post) =>
          post.userId && post.userId !== userId && followedIds.has(post.userId),
      )
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, MAX_POSTS);
  }, [posts, following, userId]);

  // Cada coluna empilha 2 posts; o scroll horizontal passa de coluna em coluna.
  const columns = useMemo(() => {
    const result: UserPostDTO[][] = [];
    for (let i = 0; i < feedPosts.length; i += POSTS_PER_COLUMN) {
      result.push(feedPosts.slice(i, i + POSTS_PER_COLUMN));
    }
    return result;
  }, [feedPosts]);

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={COLUMN_WIDTH + COLUMN_GAP}
          snapToAlignment="start"
          // Sangra até a borda da tela, mantendo o alinhamento do título.
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
        >
          {columns.map((column, columnIndex) => (
            <View
              key={columnIndex}
              style={styles.column}
              lightColor="transparent"
              darkColor="transparent"
            >
              {column.map((post, rowIndex) => {
                const index = columnIndex * POSTS_PER_COLUMN + rowIndex;
                return (
                  <PostCard
                    key={post.id ?? index}
                    post={post}
                    colorIndex={index}
                    compact
                    likedByMe={post.likedUserIds?.includes(userId) ?? false}
                    onLikePress={() => handleToggleLike(post)}
                    onUserPress={
                      post.userId ? () => onUserPress?.(post.userId!) : undefined
                    }
                    onCommentsPress={
                      post.id ? () => setCommentsPostId(post.id!) : undefined
                    }
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
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

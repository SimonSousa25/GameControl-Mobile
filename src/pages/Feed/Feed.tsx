import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Switch, TouchableOpacity } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import KeyboardAwareScrollView from "@/components/KeyboardAwareScrollView/KeyboardAwareScrollView";
import NavBottom from "@/components/NavBottom/NavBottom";
import PostCommentsModal from "@/components/modals/PostCommentsModal/PostCommentsModal";
import PostCard from "@/components/PostCard/PostCard";
import PostComposer from "@/components/PostComposer/PostComposer";
import { Text, View } from "@/components/Themed";
import userPostService, { UserPostDTO } from "@/services/userPostService";

import { styles } from "./styles";

/** Posts por página: o suficiente para encher a tela sem baixar o feed inteiro. */
const PAGE_SIZE = 10;

export interface FeedProps {
  userId: string;
  onBackPress?: () => void;
  onTabPress?: (tabId: string) => void;
  onUserPress?: (userId: string) => void;
  onDeletePress?: (userId: string) => void;
}

export function Feed({ userId, onBackPress, onTabPress, onUserPress }: FeedProps) {
  const [posts, setPosts] = useState<UserPostDTO[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [hideOwnPosts, setHideOwnPosts] = useState(false);
  const generationRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [userId, hideOwnPosts]),
  );

  const loadPosts = async () => {
    const generation = ++generationRef.current;
    try {
      setLoading(true);
      // O backend filtra quem o usuário segue, ordena e pagina.
      const page = await userPostService.listarFeed({
        limit: PAGE_SIZE,
        incluirProprios: !hideOwnPosts,
      });
      if (generation !== generationRef.current) return;
      setPosts(page.itens);
      setNextCursor(page.proximoCursor ?? null);
      setHasMore(page.temMais);
    } catch (error) {
      console.error("Erro ao carregar o feed:", error);
      if (generation !== generationRef.current) return;
      setPosts([]);
      setNextCursor(null);
      setHasMore(false);
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || !nextCursor || loading || loadingMore) return;
    const generation = generationRef.current;
    try {
      setLoadingMore(true);
      const page = await userPostService.listarFeed({
        limit: PAGE_SIZE,
        cursor: nextCursor,
        incluirProprios: !hideOwnPosts,
      });
      if (generation !== generationRef.current) return;
      setPosts((prev) => {
        const known = new Set(prev.map((post) => post.id));
        return [...prev, ...page.itens.filter((post) => !known.has(post.id))];
      });
      setNextCursor(page.proximoCursor ?? null);
      setHasMore(page.temMais);
    } catch (error) {
      // Mantém o que já está na tela e o botão, para tentar de novo.
      console.error("Erro ao carregar mais posts do feed:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // O post recém-criado entra no topo localmente; com "Ocultar meus posts" ele fica de fora.
  const visiblePosts = useMemo(
    () => (hideOwnPosts ? posts.filter((post) => post.userId !== userId) : posts),
    [posts, userId, hideOwnPosts],
  );

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
    if (!post.id || post.userId !== userId) return;

    try {
      await userPostService.deletarPost(post.id);
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  const handleEditPost = async (post: UserPostDTO, newText: string) => {
    if (!post.id || post.userId !== userId) return;

    const updated = await userPostService.editarPost(post.id, newText);
    setPosts((prev) =>
      prev.map((item) => (item.id === post.id ? updated : item)),
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View style={styles.titleBar} lightColor="transparent" darkColor="transparent">
        <BackButton onPress={onBackPress} />
        <View style={styles.titleTextWrap} lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>Feed Geral</Text>
          <Text style={styles.subtitle}>
            Suas publicações e as dos usuários que você segue
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PostComposer onSubmit={handleSubmitPost} />

        <View style={styles.sectionHeaderRow} lightColor="transparent" darkColor="transparent">
          <View style={styles.sectionTitleRow} lightColor="transparent" darkColor="transparent">
            <LinearGradient
              colors={["#0559AB", "#F22E8F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.sectionGradientBar}
            />
            <Text style={styles.sectionTitle}>Publicações</Text>
          </View>
          <Text style={styles.sectionSort}>Mais recentes primeiro</Text>
        </View>

        <View style={styles.hideOwnRow} lightColor="transparent" darkColor="transparent">
          <Text style={styles.hideOwnLabel}>Ocultar meus posts</Text>
          <Switch
            value={hideOwnPosts}
            onValueChange={setHideOwnPosts}
            trackColor={{ false: "#152637", true: "#E51580" }}
            thumbColor={hideOwnPosts ? "#FFFFFF" : "#D8F3FF"}
            ios_backgroundColor="#152637"
            style={styles.hideOwnSwitch}
          />
        </View>

        {loading ? (
          <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
            <ActivityIndicator size="large" color="#F52E8F" />
          </View>
        ) : visiblePosts.length === 0 ? (
          <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
            <Ionicons name="chatbubble-outline" size={28} color="#6B7280" />
            <Text style={styles.stateText}>
              {hideOwnPosts
                ? "Nenhuma publicação de quem você segue por enquanto."
                : "Siga outros jogadores pra ver as publicações deles aqui."}
            </Text>
          </View>
        ) : (
          visiblePosts.map((post, index) => (
            <PostCard
              key={post.id ?? index}
              post={post}
              colorIndex={index}
              likedByMe={post.likedUserIds?.includes(userId) ?? false}
              isOwnPost={post.userId === userId}
              onLikePress={() => handleToggleLike(post)}
              onUserPress={post.userId ? () => onUserPress?.(post.userId!) : undefined}
              onCommentsPress={post.id ? () => setCommentsPostId(post.id!) : undefined}
              onDeletePress={
                post.userId === userId ? () => handleDeletePost(post) : undefined
              }
              onEditSubmit={
                post.userId === userId
                  ? (newText) => handleEditPost(post, newText)
                  : undefined
              }
            />
          ))
        )}

        {!loading && hasMore ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Carregar mais publicações"
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={loadingMore}
            activeOpacity={0.8}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#F52E8F" />
            ) : (
              <Text style={styles.loadMoreText}>Carregar mais</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </KeyboardAwareScrollView>

      <NavBottom activeTab="feed" onTabPress={onTabPress} />

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

export default Feed;

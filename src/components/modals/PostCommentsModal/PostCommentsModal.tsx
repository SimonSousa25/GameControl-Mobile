import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ScaledTextInput as TextInput } from "@/components/ScaledText/ScaledText";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text, View } from "@/components/Themed";
import postCommentService, {
  PostCommentDTO,
} from "@/services/postCommentService";
import { getAvatarUrl } from "@/utils/avatar";
import { useKeyboard } from "@/utils/useKeyboard";

import { styles } from "./styles";

export interface PostCommentsModalProps {
  visible: boolean;
  postId: string | null;
  userId: string;
  onClose: () => void;
  onCommentAdded?: (commentId?: string) => void;
  onCommentDeleted?: (commentId: string) => void;
}

function formatCommentDate(value?: string): string {
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

export function PostCommentsModal({
  visible,
  postId,
  userId,
  onClose,
  onCommentAdded,
  onCommentDeleted,
}: PostCommentsModalProps) {
  const [comments, setComments] = useState<PostCommentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [openMenuCommentId, setOpenMenuCommentId] = useState<string | null>(null);
  const [deleteHoveredCommentId, setDeleteHoveredCommentId] = useState<
    string | null
  >(null);
  const [editHoveredCommentId, setEditHoveredCommentId] = useState<
    string | null
  >(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [savingEditCommentId, setSavingEditCommentId] = useState<string | null>(
    null,
  );
  const keyboard = useKeyboard();
  const listRef = useRef<ScrollView>(null);
  // Posição Y de cada comentário dentro da lista, para rolar até o que está sendo editado.
  const rowOffsets = useRef<Record<string, number>>({});

  useEffect(() => {
    // O modal permanece montado quando é fechado, então limpamos o menu manualmente.
    setOpenMenuCommentId(null);
    setDeleteHoveredCommentId(null);
    setEditHoveredCommentId(null);
    setEditingCommentId(null);

    if (!visible || !postId) return;
    setText("");
    loadComments(postId);
  }, [visible, postId]);

  const loadComments = async (id: string) => {
    try {
      setLoading(true);
      const data = await postCommentService.listarComentariosDoPost(id);
      setComments(
        [...data].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? "")),
      );
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !postId || sending) return;
    try {
      setSending(true);
      const created = await postCommentService.criarComentario({
        userId,
        postId,
        content: trimmed,
      });
      setComments((prev) => [...prev, created]);
      setText("");
      onCommentAdded?.(created.id);
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    } finally {
      setSending(false);
    }
  };

  // Com o teclado aberto o card encolhe e a lista fica curta: alinhar o
  // comentário em edição ao topo da lista o mantém visível acima do teclado.
  // Roda ao iniciar a edição e de novo quando a lista é redimensionada
  // (o teclado abrindo/fechando muda a altura do card).
  const scrollToEditingComment = useCallback(() => {
    if (!editingCommentId) return;
    const y = rowOffsets.current[editingCommentId];
    if (y === undefined) return;
    listRef.current?.scrollTo({ y: Math.max(0, y - 4), animated: true });
  }, [editingCommentId]);

  useEffect(() => {
    scrollToEditingComment();
  }, [scrollToEditingComment]);

  const startEditingComment = (comment: PostCommentDTO) => {
    if (!comment.id) return;
    setOpenMenuCommentId(null);
    setDeleteHoveredCommentId(null);
    setEditHoveredCommentId(null);
    setEditCommentText(comment.content ?? "");
    setEditingCommentId(comment.id);
  };

  const cancelEditingComment = () => {
    Keyboard.dismiss();
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleSaveEditComment = async (comment: PostCommentDTO) => {
    const trimmed = editCommentText.trim();
    if (!comment.id || !trimmed || savingEditCommentId) return;

    try {
      setSavingEditCommentId(comment.id);
      const updated = await postCommentService.editarComentario(comment.id, trimmed);
      setComments((prev) =>
        prev.map((item) => (item.id === comment.id ? updated : item)),
      );
      Keyboard.dismiss();
      setEditingCommentId(null);
    } catch (error) {
      console.error("Erro ao editar comentário:", error);
    } finally {
      setSavingEditCommentId(null);
    }
  };

  const handleDeleteComment = async (comment: PostCommentDTO) => {
    if (!comment.id || comment.userId !== userId) return;

    try {
      await postCommentService.deletarComentario(comment.id);
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
      setOpenMenuCommentId(null);
      setDeleteHoveredCommentId(null);
      onCommentDeleted?.(comment.id);
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      // Android: a janela do modal ocupa a tela toda (inclusive sob as barras do
      // sistema). Assim as coordenadas batem com as do teclado e o
      // KeyboardAvoidingView calcula o espaço certo.
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* O card fica centralizado na área livre acima do teclado. */}
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.overlay, keyboard.visible && styles.overlayKeyboardOpen]}
        contentContainerStyle={styles.overlayContent}
      >
        <View style={[styles.card, keyboard.visible && styles.cardKeyboardOpen]}>
          <View style={styles.headerRow} lightColor="transparent" darkColor="transparent">
            <View style={styles.headerLeft} lightColor="transparent" darkColor="transparent">
              <View style={styles.titleBar} />
              <Text style={styles.title}>Comentários</Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
              <ActivityIndicator size="small" color="#F52E8F" />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.stateContainer} lightColor="transparent" darkColor="transparent">
              <Text style={styles.stateText}>Nenhum comentário ainda.</Text>
            </View>
          ) : (
            <ScrollView
              ref={listRef}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              // Sem isso, tocar em Salvar/Cancelar com o teclado aberto só
              // fecha o teclado e exige um segundo toque.
              keyboardShouldPersistTaps="handled"
              onLayout={scrollToEditingComment}
            >
              {comments.map((comment, index) => {
                const avatarUrl = getAvatarUrl(comment.profilePictureUrl);
                return (
                <View
                  key={comment.id ?? index}
                  testID={`comment-row-${comment.id}`}
                  onLayout={(event) => {
                    if (comment.id) {
                      rowOffsets.current[comment.id] = event.nativeEvent.layout.y;
                    }
                  }}
                  style={[
                    styles.commentRowLayout,
                    openMenuCommentId === comment.id && styles.rowMenuOpen,
                  ]}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <View
                    style={styles.row}
                    lightColor="transparent"
                    darkColor="transparent"
                  >
                    {avatarUrl ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        style={styles.rowAvatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <AvatarGradient
                        initial={(comment.username || "?")
                          .charAt(0)
                          .toUpperCase()}
                        colorIndex={index}
                      />
                    )}
                    <View
                      style={styles.rowTextWrap}
                      lightColor="transparent"
                      darkColor="transparent"
                    >
                      <View
                        style={styles.rowHeaderRow}
                        lightColor="transparent"
                        darkColor="transparent"
                      >
                        <Text style={styles.rowUsername} numberOfLines={1}>
                          {comment.username}
                        </Text>
                        <Text style={styles.rowDate}>
                          {formatCommentDate(comment.createdAt)}
                        </Text>
                      </View>
                      {editingCommentId === comment.id ? (
                        <View
                          style={styles.editContainer}
                          lightColor="transparent"
                          darkColor="transparent"
                        >
                          <TextInput
                            style={styles.editInput}
                            value={editCommentText}
                            onChangeText={setEditCommentText}
                            placeholderTextColor="#5C6478"
                            multiline
                            autoFocus
                          />
                          <View
                            style={styles.editButtonsRow}
                            lightColor="transparent"
                            darkColor="transparent"
                          >
                            <TouchableOpacity
                              accessibilityLabel="Cancelar edição"
                              accessibilityRole="button"
                              style={styles.editCancelButton}
                              activeOpacity={0.8}
                              disabled={savingEditCommentId === comment.id}
                              onPress={cancelEditingComment}
                            >
                              <Text style={styles.editCancelButtonText}>
                                Cancelar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              accessibilityLabel="Salvar edição"
                              accessibilityRole="button"
                              style={[
                                styles.editSaveButton,
                                (!editCommentText.trim() ||
                                  savingEditCommentId === comment.id) &&
                                  styles.editSaveButtonDisabled,
                              ]}
                              activeOpacity={0.8}
                              disabled={
                                !editCommentText.trim() ||
                                savingEditCommentId === comment.id
                              }
                              onPress={() => handleSaveEditComment(comment)}
                            >
                              {savingEditCommentId === comment.id ? (
                                <ActivityIndicator size="small" color="#F5F7FF" />
                              ) : (
                                <Text style={styles.editSaveButtonText}>
                                  Salvar
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.rowContent,
                            openMenuCommentId === comment.id &&
                              styles.rowContentMenuOpen,
                          ]}
                        >
                          {comment.content}
                          {comment.edited && (
                            <Text style={styles.editedTag}> (editado)</Text>
                          )}
                        </Text>
                      )}
                    </View>

                    {comment.userId === userId &&
                      comment.id &&
                      editingCommentId !== comment.id && (
                      <View
                        style={styles.commentMenuContainer}
                        lightColor="transparent"
                        darkColor="transparent"
                      >
                        <TouchableOpacity
                          accessibilityLabel="Opções do comentário"
                          accessibilityRole="button"
                          style={styles.commentMenuButton}
                          activeOpacity={0.7}
                          onPress={() => {
                            setDeleteHoveredCommentId(null);
                            setOpenMenuCommentId((current) =>
                              current === comment.id ? null : comment.id!,
                            );
                          }}
                          hitSlop={6}
                        >
                          <Ionicons
                            name="ellipsis-vertical"
                            size={17}
                            color="#A0A0A0"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {comment.userId === userId &&
                    comment.id &&
                    openMenuCommentId === comment.id && (
                      <View style={styles.commentActionMenu}>
                        <Pressable
                          accessibilityLabel="Editar comentário"
                          accessibilityRole="button"
                          onHoverIn={() => setEditHoveredCommentId(comment.id!)}
                          onHoverOut={() => setEditHoveredCommentId(null)}
                          style={({ pressed }) => [
                            styles.commentActionMenuItem,
                            (editHoveredCommentId === comment.id || pressed) &&
                              styles.commentActionMenuItemActive,
                          ]}
                          onPress={() => startEditingComment(comment)}
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={15}
                            color={
                              editHoveredCommentId === comment.id
                                ? "#F5F7FF"
                                : "#CBD2DF"
                            }
                          />
                          <Text
                            style={[
                              styles.commentActionMenuText,
                              editHoveredCommentId === comment.id &&
                                styles.commentActionMenuTextActive,
                            ]}
                          >
                            Editar
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Excluir comentário"
                          accessibilityRole="button"
                          onHoverIn={() =>
                            setDeleteHoveredCommentId(comment.id!)
                          }
                          onHoverOut={() => setDeleteHoveredCommentId(null)}
                          style={({ pressed }) => [
                            styles.commentActionMenuItem,
                            (deleteHoveredCommentId === comment.id || pressed) &&
                              styles.commentActionMenuItemActive,
                          ]}
                          onPress={() => handleDeleteComment(comment)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={15}
                            color={
                              deleteHoveredCommentId === comment.id
                                ? "#FFD5DC"
                                : "#CBD2DF"
                            }
                          />
                          <Text
                            style={[
                              styles.commentActionMenuText,
                              deleteHoveredCommentId === comment.id &&
                                styles.commentActionMenuTextActive,
                            ]}
                          >
                            Excluir
                          </Text>
                        </Pressable>
                      </View>
                    )}
                </View>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.inputRow} lightColor="transparent" darkColor="transparent">
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#5C6478"
              multiline
            />
            <TouchableOpacity
              accessibilityLabel="Enviar comentário"
              accessibilityRole="button"
              style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
              activeOpacity={0.8}
              disabled={!text.trim() || sending}
              onPress={handleSend}
            >
              <Ionicons name="send" size={16} color="#F5F7FF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default PostCommentsModal;

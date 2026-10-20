import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text, View } from "@/components/Themed";
import postCommentService, {
  PostCommentDTO,
} from "@/services/postCommentService";

import { styles } from "./styles";

export interface PostCommentsModalProps {
  visible: boolean;
  postId: string | null;
  userId: string;
  onClose: () => void;
  onCommentAdded?: (commentId?: string) => void;
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
}: PostCommentsModalProps) {
  const [comments, setComments] = useState<PostCommentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={styles.overlay}
        lightColor="rgba(3, 7, 13, 0.85)"
        darkColor="rgba(3, 7, 13, 0.85)"
      >
        <View style={styles.card}>
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
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {comments.map((comment, index) => (
                <View
                  key={comment.id ?? index}
                  style={styles.row}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <AvatarGradient
                    initial={(comment.username || "?").charAt(0).toUpperCase()}
                    colorIndex={index}
                  />
                  <View style={styles.rowTextWrap} lightColor="transparent" darkColor="transparent">
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
                    <Text style={styles.rowContent}>{comment.content}</Text>
                  </View>
                </View>
              ))}
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
      </View>
    </Modal>
  );
}

export default PostCommentsModal;

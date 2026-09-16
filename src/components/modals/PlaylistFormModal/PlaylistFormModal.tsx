import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface PlaylistFormValues {
  nome: string;
  descricao: string;
}

export interface PlaylistFormModalProps {
  visible: boolean;
  mode: "create" | "edit";
  initialValues?: PlaylistFormValues;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: PlaylistFormValues) => void;
}

const EMPTY_VALUES: PlaylistFormValues = { nome: "", descricao: "" };

export function PlaylistFormModal({
  visible,
  mode,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: PlaylistFormModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (visible) {
      setNome(initialValues?.nome ?? EMPTY_VALUES.nome);
      setDescricao(initialValues?.descricao ?? EMPTY_VALUES.descricao);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const canSubmit = nome.trim().length > 0 && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ nome: nome.trim(), descricao: descricao.trim() });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={styles.overlay}
        lightColor="rgba(3, 7, 13, 0.85)"
        darkColor="rgba(3, 7, 13, 0.85)"
      >
        <View style={styles.card}>
          <View
            style={styles.headerRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <View
              style={styles.headerLeft}
              lightColor="transparent"
              darkColor="transparent"
            >
              <View style={styles.titleBar} />
              <Text style={styles.title}>
                {mode === "edit" ? "Editar playlist" : "Criar playlist"}
              </Text>
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

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome da playlist"
            placeholderTextColor="#5C6478"
            maxLength={100}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descrição da playlist"
            placeholderTextColor="#5C6478"
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <View
            style={styles.footerRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !canSubmit && styles.saveButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.saveButtonText}>
                {submitting ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default PlaylistFormModal;

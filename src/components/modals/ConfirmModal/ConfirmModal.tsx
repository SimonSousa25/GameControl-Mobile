import { Modal, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  submitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  submitting = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={styles.overlay}
        lightColor="rgba(3, 7, 13, 0.85)"
        darkColor="rgba(3, 7, 13, 0.85)"
      >
        <View style={styles.card}>
          <View
            style={styles.titleRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <View
              style={[styles.titleBar, destructive && styles.titleBarDanger]}
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View
            style={styles.footerRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onCancel}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                destructive && styles.confirmButtonDanger,
                submitting && styles.confirmButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={submitting}
            >
              <Text style={styles.confirmButtonText}>
                {submitting ? "Aguarde..." : confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmModal;

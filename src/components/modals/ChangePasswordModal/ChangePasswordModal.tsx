import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import type { TextInput as NativeTextInput, TextInputProps } from "react-native";

import {
  ScaledText as Text,
  ScaledTextInput as TextInput,
} from "@/components/ScaledText/ScaledText";

import { styles } from "./styles";

const MIN_PASSWORD_LENGTH = 8;

interface ChangePasswordModalProps {
  onCancel: () => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  onSuccess: () => void;
}

interface PasswordInputProps extends TextInputProps {
  accessibilityLabel: string;
  inputRef?: RefObject<NativeTextInput | null>;
}

function PasswordInput({
  accessibilityLabel,
  editable = true,
  inputRef,
  ...inputProps
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.passwordInputWrapper}>
      <TextInput
        {...inputProps}
        ref={inputRef}
        accessibilityLabel={accessibilityLabel}
        style={[styles.input, styles.inputWithEye]}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
        secureTextEntry={!visible}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${visible ? "Ocultar" : "Mostrar"} ${accessibilityLabel.toLowerCase()}`}
        disabled={!editable}
        onPress={() => setVisible((current) => !current)}
        style={styles.eyeButton}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="#FF55AE"
        />
      </Pressable>
    </View>
  );
}

export default function ChangePasswordModal({
  onCancel,
  onChangePassword,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const newPasswordInput = useRef<NativeTextInput>(null);
  const confirmationInput = useRef<NativeTextInput>(null);

  const handleCancel = () => {
    if (inFlight.current) return;
    Keyboard.dismiss();
    onCancel();
  };

  const handleSubmit = async () => {
    if (inFlight.current) return;
    if (!currentPassword) {
      setError("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH || !newPassword.trim()) {
      setError(
        `Informe uma nova senha com pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
      return;
    }
    if (newPassword !== confirmation) {
      setError("A confirmação deve ser igual à nova senha.");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setError("");
    Keyboard.dismiss();
    try {
      await onChangePassword(currentPassword, newPassword);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha.",
      );
      return;
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
    onSuccess();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <KeyboardAvoidingView style={styles.overlay} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View
            nativeID="change-password-modal"
            style={styles.card}
            accessibilityViewIsModal
          >
            <View style={styles.heading}>
              <View style={styles.icon}>
                <Ionicons name="key-outline" size={18} color="#FF55AE" />
              </View>
              <View style={styles.headingCopy}>
                <Text accessibilityRole="header" style={styles.title}>
                  Alterar senha
                </Text>
                <Text style={styles.description}>
                  Confirme sua senha atual para continuar.
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha atual</Text>
              <PasswordInput
                accessibilityLabel="Senha atual"
                autoComplete="current-password"
                editable={!submitting}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => newPasswordInput.current?.focus()}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nova senha</Text>
              <PasswordInput
                inputRef={newPasswordInput}
                accessibilityLabel="Nova senha"
                autoComplete="new-password"
                editable={!submitting}
                value={newPassword}
                onChangeText={setNewPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => confirmationInput.current?.focus()}
              />
              <Text style={styles.hint}>
                Use pelo menos {MIN_PASSWORD_LENGTH} caracteres.
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirme a nova senha</Text>
              <PasswordInput
                inputRef={confirmationInput}
                accessibilityLabel="Confirmação da nova senha"
                autoComplete="new-password"
                editable={!submitting}
                value={confirmation}
                onChangeText={setConfirmation}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleCancel}
                disabled={submitting}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Salvar nova senha"
                accessibilityState={{ busy: submitting, disabled: submitting }}
                onPress={handleSubmit}
                disabled={submitting}
                style={[
                  styles.button,
                  styles.saveButton,
                  submitting && styles.submitting,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Salvar nova senha</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

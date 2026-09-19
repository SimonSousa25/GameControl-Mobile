import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { StyleProp, ViewStyle } from "react-native";

import { styles } from "./styles";

import PresentationLogo from "@/components/PresentationLogo";
import FormField from "@/components/FormField/FormField";

export interface ForgotPasswordThreeProps {
  onSubmit?: (password: string) => Promise<void>;
  onPasswordChanged?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ForgotPasswordThree({
  onSubmit,
  onPasswordChanged,
  style,
}: ForgotPasswordThreeProps) {
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Campos de senha vazios", "Preencha os dois campos de senha");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Senha muito curta",
        "Escolha uma senha com pelo menos 8 caracteres.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Senhas diferentes",
        "A confirmação precisa ser igual à senha.",
      );
      return;
    }

    // Impede que a interface simule sucesso antes da API estar conectada.
    if (!onSubmit) {
      Alert.alert(
        "Recuperação indisponível",
        "A tela está pronta, mas o endpoint para alterar a senha ainda não existe no backend.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(password);

      Alert.alert("Senha alterada", "Sua nova senha foi salva com sucesso.");
      onPasswordChanged?.();
    } catch {
      Alert.alert(
        "Não foi possível alterar a senha",
        "O link pode ter expirado. Solicite uma nova recuperação e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.keyboardAvoidingView, style]}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View accessibilityLabel="GameControl" style={styles.brand}>
            <View style={styles.brandIcon}>
              <PresentationLogo height={62} width={74} />
            </View>
            <Text style={styles.brandGame}>Game</Text>
            <Text style={styles.brandControl}>Control</Text>
          </View>

          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.title}
          >
            Recuperação
          </Text>
          <Text style={styles.subtitle}>Escolha uma senha confiável</Text>

          <View style={styles.form}>
            {/* Campo: senha */}
            <FormField
              autoCapitalize="none"
              autoComplete="new-password"
              icon="lock-closed-outline"
              inputRef={passwordInputRef}
              onChangeText={setPassword}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              onToggleVisibility={() =>
                setPasswordVisible((visible) => !visible)
              }
              passwordVisible={passwordVisible}
              placeholder="Digite sua senha"
              returnKeyType="next"
              secureTextEntry={!passwordVisible}
              value={password}
            />

            {/* Campo: confirmação da senha */}
            <FormField
              autoCapitalize="none"
              autoComplete="new-password"
              icon="lock-closed-outline"
              inputRef={confirmPasswordInputRef}
              onChangeText={setConfirmPassword}
              onSubmitEditing={handleSubmit}
              onToggleVisibility={() =>
                setConfirmPasswordVisible((visible) => !visible)
              }
              passwordVisible={confirmPasswordVisible}
              placeholder="Confirmar senha"
              returnKeyType="done"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
            />
          </View>

          {/* Ação principal do formulário */}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSubmitting && styles.submitButtonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Redefinir senha</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordThree;

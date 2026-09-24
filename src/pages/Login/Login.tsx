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

import FormField from "@/components/FormField/FormField";
import userService from "@/services/userService";
import PresentationTransition from "@/animations/PresentationTransition";

export interface LoginProps {
  onForgotPasswordPress?: () => void;
  onRegisterPress?: () => void;
  onSuccess?: (auth: { token: string }) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Login({
  onForgotPasswordPress,
  onRegisterPress,
  onSuccess,
  style,
  testID = "login-screen",
}: LoginProps) {
  const passwordInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Campos incompletos", "Preencha e-mail e senha para continuar.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      const auth = await userService.login({
        email: email.trim().toLowerCase(),
        password,
      });
      onSuccess?.(auth);
    } catch {
      Alert.alert(
        "Não foi possível entrar",
        "Verifique seu e-mail e senha e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.keyboardAvoidingView, style]}
      testID={testID}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PresentationTransition>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              numberOfLines={1}
              style={styles.title}
            >
              Bem-vindo
            </Text>
            <Text style={styles.subtitle}>
              Entre na sua conta e continue jogando
            </Text>

            <View style={styles.form}>
              {/* Campo: e-mail */}
              <FormField
                autoCapitalize="none"
                autoComplete="email"
                icon="mail-outline"
                inputMode="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder="Digite seu e-mail"
                returnKeyType="next"
                value={email}
              />

              {/* Campo: senha */}
              <FormField
                autoCapitalize="none"
                autoComplete="current-password"
                icon="lock-closed-outline"
                inputRef={passwordInputRef}
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                onToggleVisibility={() =>
                  setPasswordVisible((visible) => !visible)
                }
                passwordVisible={passwordVisible}
                placeholder="Digite sua senha"
                returnKeyType="done"
                secureTextEntry={!passwordVisible}
                value={password}
              />
            </View>

            <View style={styles.forgotPasswordRow}>
              <Pressable
                accessibilityRole="link"
                hitSlop={8}
                onPress={onForgotPasswordPress}
              >
                <Text style={styles.forgotPasswordText}>
                  Esqueceu sua senha?
                </Text>
              </Pressable>
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
                <Text style={styles.submitButtonText}>Entrar</Text>
              )}
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Não tem conta? </Text>
              <Pressable
                accessibilityRole="link"
                onPress={onRegisterPress}
                style={styles.registerLink}
              >
                <Text style={styles.registerLinkText}>Criar conta</Text>
              </Pressable>
            </View>
        </PresentationTransition>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;

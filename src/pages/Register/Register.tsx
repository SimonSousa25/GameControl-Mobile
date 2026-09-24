import { Ionicons } from "@expo/vector-icons";
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

import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

import PresentationLogo from "@/components/PresentationLogo";
import userService, { AuthResponse } from "@/services/userService";

import { styles } from "./styles";

interface FormFieldProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  inputRef?: React.RefObject<TextInput | null>;
  onToggleVisibility?: () => void;
  passwordVisible?: boolean;
}

function FormField({
  icon,
  inputRef,
  onToggleVisibility,
  passwordVisible,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={28} color="#3E4E66" />
      <TextInput
        ref={inputRef}
        placeholderTextColor="#3E4E66"
        selectionColor="#E51580"
        style={styles.fieldInput}
        {...inputProps}
      />
      {onToggleVisibility ? (
        <Pressable
          accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onToggleVisibility}
          style={styles.visibilityButton}
        >
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={30}
            color="#47658D"
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export interface RegisterProps {
  onLoginPress?: () => void;
  /** Chamado com a sessão criada pelo login automático após o cadastro. */
  onSuccess?: (auth: AuthResponse) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Register({
  onLoginPress,
  onSuccess,
  style,
  testID = "register-screen",
}: RegisterProps) {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Campos incompletos", "Preencha todos os campos para continuar.");
      return;
    }

    /* Explicação: exige "usuario@email.com" sem espaços, do início ao fim.
     * O "!" na frente inverte: se NÃO bater com esse padrão, esse if retorna 
     * uma mensagem de alerta (email inválido). */
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Senhas diferentes", "A confirmação precisa ser igual à senha.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setIsSubmitting(true);
      await userService.cadastrarUsuario({
        username: username.trim(),
        email: normalizedEmail,
        password,
      });
    } catch {
      Alert.alert(
        "Não foi possível criar a conta",
        "Verifique os dados informados e tente novamente.",
      );
      setIsSubmitting(false);
      return;
    }

    // Conta criada: entra automaticamente com as mesmas credenciais.
    try {
      const auth = await userService.login({
        email: normalizedEmail,
        password,
      });
      onSuccess?.(auth);
    } catch {
      // O cadastro deu certo, só o login automático falhou: manda para o login.
      Alert.alert(
        "Conta criada",
        "Seu cadastro foi realizado, mas não foi possível entrar automaticamente. Faça login para continuar.",
        [{ text: "Ir para o login", onPress: onLoginPress }],
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
        <View style={styles.content}>
          <View accessibilityLabel="GameControl" style={styles.brand}>
            <View style={styles.brandIcon}>
              <PresentationLogo height={62} width={74} />
            </View>
            <Text style={styles.brandGame}>Game</Text>
            <Text style={styles.brandControl}>Control</Text>
          </View>

          <Text adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={1} style={styles.title}>
            Crie sua conta
          </Text>
          <Text style={styles.subtitle}>É rápido e fácil!</Text>

          <View style={styles.form}>
            {/* Campo: nome de usuário */}
            <FormField
              autoCapitalize="none"
              autoComplete="username-new"
              icon="person-outline"
              onChangeText={setUsername}
              onSubmitEditing={() => emailInputRef.current?.focus()}
              placeholder="Nome de usuário"
              returnKeyType="next"
              value={username}
            />

            {/* Campo: e-mail */}
            <FormField
              autoCapitalize="none"
              autoComplete="email"
              icon="mail-outline"
              inputMode="email"
              inputRef={emailInputRef}
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
              autoComplete="new-password"
              icon="lock-closed-outline"
              inputRef={passwordInputRef}
              onChangeText={setPassword}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              onToggleVisibility={() => setPasswordVisible((visible) => !visible)}
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
              <Text style={styles.submitButtonText}>Criar conta</Text>
            )}
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Ja tem uma conta? </Text>
            <Pressable
              accessibilityRole="link"
              onPress={onLoginPress}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>Faça seu login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Register;

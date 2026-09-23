import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

import PresentationLogo from "@/components/PresentationLogo";

import { styles } from "./styles";

export interface ForgotPasswordProps {
  onBackToLoginPress?: () => void;
  onSubmit?: (email: string) => Promise<void>;
}

export default function ForgotPassword({
  onBackToLoginPress,
  onSubmit,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    // Validação básica do campo de e-mail.
    if (!normalizedEmail) {
      Alert.alert("Campo incompleto", "Digite seu e-mail.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.(normalizedEmail);
    } catch {
      Alert.alert(
        "Não foi possível continuar",
        "Tente novamente dentro de alguns instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.root}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Identidade visual do GameControl */}
          <View accessibilityLabel="GameControl" style={styles.brand}>
            <View style={styles.brandIcon}>
              <PresentationLogo height={62} width={74} />
            </View>

            <Text style={styles.brandGame}>Game</Text>
            <Text style={styles.brandControl}>Control</Text>
          </View>

          <Text style={styles.title}>Recuperação</Text>
          <Text style={styles.subtitle}>É rápido e fácil!</Text>

          {/* Campo de e-mail */}
          <View style={styles.field}>
            <Ionicons name="mail-outline" size={28} color="#3E4E66" />

            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              onSubmitEditing={handleSubmit}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#3E4E66"
              returnKeyType="send"
              selectionColor="#E51580"
              style={styles.fieldInput}
              value={email}
            />
          </View>

          {/* Solicita o envio do código ou link */}
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
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar</Text>
            )}
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Já tem uma conta? </Text>

            <Pressable
              accessibilityRole="link"
              onPress={onBackToLoginPress}
            >
              <Text style={styles.loginLink}>Entrar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
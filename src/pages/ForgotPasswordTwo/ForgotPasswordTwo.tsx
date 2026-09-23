import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import PresentationLogo from "@/components/PresentationLogo";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export interface ForgotPasswordProps {
  onBackToPrevScreen?: () => void;
  onBackToLoginPress?: () => void;
}

export default function ForgotPasswordTwo({
  onBackToPrevScreen,
  onBackToLoginPress,
}: ForgotPasswordProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.root}
    >
      <StatusBar style="light" />

      {/** (<-) Seta de voltar para /forgot-password */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para a tela anterior"
        onPress={onBackToPrevScreen}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={32} color="#F43B97" />
      </Pressable>

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

          <Text style={styles.title}>Quase lá</Text>
          <Text style={styles.subtitle}>
            Caso seu email esteja cadastrado em nossa base de dados, um link de
            recuperação de senha será enviado, basta clicar no link, e alterar
            sua senha.
          </Text>

          <View style={styles.loginRow}>
            <Pressable accessibilityRole="link" onPress={onBackToLoginPress}>
              <Text style={styles.loginLink}>Retornar a tela inicial</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

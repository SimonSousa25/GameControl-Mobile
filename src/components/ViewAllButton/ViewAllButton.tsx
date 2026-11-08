import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { Text } from "@/components/Themed";

import { styles, VIEW_ALL_HIT_SLOP } from "./styles";

export interface ViewAllButtonProps {
  onPress?: () => void;
  /** Texto do botão. Padrão: "Ver tudo". */
  label?: string;
  /** Texto lido por leitores de tela. Padrão: o próprio `label`. */
  accessibilityLabel?: string;
  /** Ajustes de posicionamento feitos por quem usa (ex.: margem lateral). */
  style?: StyleProp<ViewStyle>;
}

/**
 * Botão de destaque do cabeçalho das seções da home ("Ver tudo →").
 * Substitui o link de texto pequeno: tem fundo, borda e uma área de toque
 * maior, mantendo a cor da marca.
 */
export function ViewAllButton({
  onPress,
  label = "Ver tudo",
  accessibilityLabel,
  style,
}: ViewAllButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={VIEW_ALL_HIT_SLOP}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={14} color="#FF5CA8" />
    </Pressable>
  );
}

export default ViewAllButton;

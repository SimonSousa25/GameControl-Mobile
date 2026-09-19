import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  TextInput,
  View,
} from "react-native";

import type { TextInputProps } from "react-native";

import { styles } from "./styles";

interface FormFieldProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  inputRef?: React.RefObject<TextInput | null>;
  onToggleVisibility?: () => void;
  passwordVisible?: boolean;
}

export default function FormField({
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
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ScaledTextInput as TextInput } from "@/components/ScaledText/ScaledText";

import { Text } from "@/components/Themed";

import { styles } from "./styles";

const MAX_LENGTH = 280;

export interface PostComposerProps {
  onSubmit: (text: string) => Promise<void> | void;
}

export default function PostComposer({ onSubmit }: PostComposerProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    try {
      setSubmitting(true);
      await onSubmit(trimmed);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !text.trim() || submitting;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(value) => setText(value.slice(0, MAX_LENGTH))}
        placeholder="O que está rolando no seu universo gamer?"
        placeholderTextColor="#5C6478"
        multiline
        maxLength={MAX_LENGTH}
      />
      <Text style={styles.counter}>
        {text.length}/{MAX_LENGTH}
      </Text>

      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={handleSubmit}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#F5F7FF" />
        ) : (
          <>
            <Ionicons name="send" size={16} color="#F5F7FF" />
            <Text style={styles.buttonText}>Postar</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

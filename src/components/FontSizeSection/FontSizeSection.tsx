import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text as NativeText, View } from "react-native";

import { ScaledText as Text } from "@/components/ScaledText/ScaledText";
import {
  FONT_SCALE_OPTIONS,
  useFontScale,
} from "@/src/contexts/FontScaleContext";

import { styles } from "./styles";

/** Tamanho do "A" em cada botão: cresce junto com o nível que ele representa. */
const GLYPH_BASE_SIZE = 14;

/**
 * Seção de acessibilidade: tamanho da fonte do aplicativo.
 * A escolha é aplicada e salva na hora (o próprio texto da tela serve de
 * pré-visualização), por isso não depende do botão "Salvar alterações".
 */
export default function FontSizeSection() {
  const { fontScaleId, setFontScaleId } = useFontScale();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="text-outline" size={19} color="#F43B97" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Tamanho da fonte</Text>
          <Text style={styles.subtitle}>
            Acessibilidade: deixe os textos mais fáceis de ler
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View accessibilityRole="radiogroup" style={styles.options}>
        {FONT_SCALE_OPTIONS.map((option) => {
          const selected = option.id === fontScaleId;

          return (
            <Pressable
              key={option.id}
              accessibilityLabel={`Tamanho da fonte ${option.label}`}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setFontScaleId(option.id)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <NativeText
                allowFontScaling={false}
                style={[
                  styles.optionGlyph,
                  { fontSize: GLYPH_BASE_SIZE * option.scale },
                ]}
              >
                {option.short}
              </NativeText>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>Pré-visualização</Text>
        <Text style={styles.previewText}>
          Assim os textos do GameControl vão aparecer para você em todas as
          telas do aplicativo.
        </Text>
      </View>
    </View>
  );
}

import { forwardRef, useMemo } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
} from "react-native";
import type { StyleProp, TextInputProps, TextProps, TextStyle } from "react-native";

import { useFontScale } from "@/src/contexts/FontScaleContext";

/** Tamanho padrão do React Native quando o estilo não define fontSize. */
const RN_DEFAULT_FONT_SIZE = 14;

/**
 * Limita o aumento vindo das configurações do SISTEMA. O app já aplica o
 * próprio multiplicador por cima; sem esse teto os dois somariam
 * (ex.: 1.5 do sistema x 1.5 do app = 2.25x) e quebrariam o layout.
 */
export const MAX_SYSTEM_FONT_MULTIPLIER = 1.2;

/**
 * Devolve o estilo com fontSize e lineHeight multiplicados.
 * Com escala 1 devolve o MESMO estilo recebido: custo zero no caso padrão.
 */
export function scaleTextStyle(
  style: StyleProp<TextStyle>,
  scale: number,
): StyleProp<TextStyle> {
  if (scale === 1) return style;

  const flat = StyleSheet.flatten(style) ?? {};
  const scaled: TextStyle = {
    ...flat,
    fontSize: Math.round((flat.fontSize ?? RN_DEFAULT_FONT_SIZE) * scale * 10) / 10,
  };
  if (flat.lineHeight != null) {
    scaled.lineHeight = Math.round(flat.lineHeight * scale * 10) / 10;
  }
  return scaled;
}

function useScaledStyle(style: StyleProp<TextStyle>) {
  const { fontScale } = useFontScale();
  return useMemo(() => scaleTextStyle(style, fontScale), [style, fontScale]);
}

/** Substituto do <Text> do React Native que respeita o tamanho de fonte do app. */
export const ScaledText = forwardRef<RNText, TextProps>(function ScaledText(
  { style, maxFontSizeMultiplier, ...rest },
  ref,
) {
  const scaledStyle = useScaledStyle(style);
  return (
    <RNText
      ref={ref}
      style={scaledStyle}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? MAX_SYSTEM_FONT_MULTIPLIER}
      {...rest}
    />
  );
});

/** Substituto do <TextInput> do React Native que respeita o tamanho de fonte do app. */
export const ScaledTextInput = forwardRef<RNTextInput, TextInputProps>(
  function ScaledTextInput({ style, maxFontSizeMultiplier, ...rest }, ref) {
    const scaledStyle = useScaledStyle(style);
    return (
      <RNTextInput
        ref={ref}
        style={scaledStyle}
        maxFontSizeMultiplier={maxFontSizeMultiplier ?? MAX_SYSTEM_FONT_MULTIPLIER}
        {...rest}
      />
    );
  },
);

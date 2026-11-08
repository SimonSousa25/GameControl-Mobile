import { StyleSheet } from "react-native";

/**
 * Área de toque mínima recomendada (iOS HIG ~44pt, Material 48dp).
 * O botão em si tem ~32px de altura; o hitSlop completa o resto sem
 * alterar o layout do cabeçalho.
 */
export const VIEW_ALL_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    // Nunca encolhe: quem cede espaço, se faltar, é o título ao lado.
    flexShrink: 0,
    gap: 4,
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(245, 46, 143, 0.65)",
    backgroundColor: "rgba(245, 46, 143, 0.14)",
  },
  buttonPressed: {
    backgroundColor: "rgba(245, 46, 143, 0.3)",
  },
  label: {
    color: "#FF5CA8",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    fontWeight: "700",
  },
});

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#060B14",
  },
  header: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  headerIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F43B97",
    backgroundColor: "#31041A",
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
  subtitle: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#123048",
  },
  options: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  option: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#101B26",
  },
  optionSelected: {
    borderColor: "#E51580",
    backgroundColor: "#31041A",
  },
  // O "A" de cada botão já usa o tamanho que representa; por isso usa Text nativo
  // (sem escala) para o botão não mudar de tamanho junto com o resto do app.
  optionGlyph: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
  },
  optionLabel: {
    color: "#9AA4B5",
    fontFamily: "OrbitronMedium",
    fontSize: 8,
  },
  optionLabelSelected: {
    color: "#FFFFFF",
  },
  previewBox: {
    gap: 6,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#123048",
  },
  previewTitle: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 12,
  },
  previewText: {
    color: "#9AA4B5",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
    lineHeight: 15,
  },
});

import { StyleSheet } from "react-native";

// Estilos dos campos de input
export const styles = StyleSheet.create({
  field: {
    width: "100%",
    height: 69,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3E4E66",
    borderRadius: 16,
    backgroundColor: "#051124",
  },
  fieldInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 16,
    fontWeight: "500",
    textAlignVertical: "center",
  },
  visibilityButton: {
    width: 30,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

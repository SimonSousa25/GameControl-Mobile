import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#F52E8F",
  },
  title: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 16,
    fontWeight: "700",
  },
  label: {
    color: "#00E5FF",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#051124",
    borderWidth: 1,
    borderColor: "#3E4E66",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#F5F7FF",
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    height: 84,
    textAlignVertical: "top",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3E4E66",
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#AAB2C0",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E51580",
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
  },
});

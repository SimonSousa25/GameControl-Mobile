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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  titleBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#F52E8F",
  },
  titleBarDanger: {
    backgroundColor: "#FF4D5E",
  },
  title: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 16,
    fontWeight: "700",
  },
  message: {
    color: "#AAB2C0",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  messageWithWarning: {
    marginBottom: 10,
  },
  warning: {
    color: "#FF4D5E",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
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
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E51580",
  },
  confirmButtonDanger: {
    backgroundColor: "#C41730",
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
  },
});

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(1, 4, 11, 0.79)",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    padding: 17,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#19324A",
    backgroundColor: "#060B14",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headingCopy: {
    flex: 1,
  },
  icon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#9B2E65",
    backgroundColor: "#2C1024",
  },
  title: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 16,
  },
  description: {
    color: "#A6B2C7",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
    marginTop: 3,
  },
  field: {
    gap: 4,
  },
  label: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#19324A",
    backgroundColor: "#051124",
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
    fontSize: 16,
  },
  passwordInputWrapper: {
    position: "relative",
  },
  inputWithEye: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    color: "#A6B2C7",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
  },
  error: {
    color: "#FF8DAB",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#19324A",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#C80D70",
  },
  submitting: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    textAlign: "center",
  },
});

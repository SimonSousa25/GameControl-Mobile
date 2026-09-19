import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#03070D",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#03070D",
  },
  title: {
    width: "100%",
    marginTop: 32,
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 40,
    fontWeight: "500",
    lineHeight: 50,
    textAlign: "center",
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 5,
    color: "#6F7783",
    fontFamily: "OrbitronMedium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
    includeFontPadding: false,
  },
  form: {
    width: "100%",
    gap: 20,
    marginTop: 30,
  },
  
  forgotPasswordRow: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 14,
  },
  forgotPasswordText: {
    color: "#00E5FF",
    fontFamily: "OrbitronMedium",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  submitButton: {
    width: "100%",
    height: 69,
    marginTop: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#E51580",
  },
  submitButtonPressed: {
    opacity: 0.82,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 33,
    includeFontPadding: false,
  },
  registerRow: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 23,
  },
  registerPrompt: {
    color: "#AAB2C0",
    fontFamily: "OrbitronMedium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  registerLink: {
    minHeight: 30,
    justifyContent: "center",
  },
  registerLinkText: {
    color: "#00E5FF",
    fontFamily: "OrbitronMedium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
});

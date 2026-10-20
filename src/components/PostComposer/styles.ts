import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  input: {
    minHeight: 80,
    backgroundColor: "#0A0E15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlignVertical: "top",
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: 4,
    color: "#5C6478",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    backgroundColor: "#F52E8F",
    borderRadius: 24,
    paddingVertical: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },
});

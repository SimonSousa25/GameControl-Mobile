import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 92,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  buttonFollow: {
    backgroundColor: "#F52E8F",
    borderColor: "#F52E8F",
  },
  buttonFollowing: {
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    borderColor: "rgba(0, 229, 255, 0.45)",
  },
  buttonRequested: {
    backgroundColor: "rgba(170, 178, 192, 0.08)",
    borderColor: "rgba(170, 178, 192, 0.45)",
  },
  buttonCooldown: {
    backgroundColor: "rgba(107, 114, 128, 0.08)",
    borderColor: "rgba(107, 114, 128, 0.35)",
  },
  label: {
    fontFamily: "OrbitronBold",
    fontSize: 11,
    fontWeight: "700",
  },
});

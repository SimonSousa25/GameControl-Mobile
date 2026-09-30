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
  label: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 11,
    fontWeight: "700",
  },
  labelFollowing: {
    color: "#00E5FF",
  },
});

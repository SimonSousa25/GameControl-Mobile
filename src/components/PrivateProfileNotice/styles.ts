import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 14,
    alignItems: "center",
    gap: 10,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(0, 229, 255, 0.15)",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 46, 143, 0.5)",
    backgroundColor: "rgba(245, 46, 143, 0.08)",
  },
  title: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  text: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
  },
});

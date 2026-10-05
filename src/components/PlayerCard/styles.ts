import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardGradient: {
    padding: 1,
    borderRadius: 10,
  },
  userCard: {
    width: 62,
    backgroundColor: "#0A0E15",
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: "center",
    gap: 5,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F52E8F",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 46, 143, 0.1)",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    fontSize: 6,
    fontWeight: "600",
    color: "#F5F7FF",
    fontFamily: "Orbitron",
    textAlign: "center",
    maxWidth: 56,
    minHeight: 16,
  },
  followButton: {
    backgroundColor: "#F52E8F",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonText: {
    fontSize: 6,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Orbitron",
  },
});

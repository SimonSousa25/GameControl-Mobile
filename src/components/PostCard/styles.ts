import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    backgroundColor: "#0A0E15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03070D",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  usernameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    flexShrink: 1,
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
  },
  ownBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(245, 46, 143, 0.15)",
  },
  ownBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F52E8F",
    letterSpacing: 0.5,
  },
  date: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
  },
  content: {
    marginTop: 10,
    color: "#CBD2DF",
    fontFamily: "Orbitron",
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 229, 255, 0.08)",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
  },
  footerTextActive: {
    color: "#F52E8F",
  },
});

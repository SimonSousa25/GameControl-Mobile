import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(244, 59, 151, 0.45)",
    backgroundColor: "#0C0A16",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.45)",
    backgroundColor: "#03070D",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    backgroundColor: "transparent",
  },
  message: {
    color: "#CBD2DF",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    lineHeight: 16,
  },
  username: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
  },
  time: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: "#F52E8F",
    borderColor: "#F52E8F",
  },
  rejectButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(170, 178, 192, 0.45)",
  },
  disabled: {
    opacity: 0.6,
  },
  acceptText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 11,
    fontWeight: "700",
  },
  rejectText: {
    color: "#AAB2C0",
    fontFamily: "OrbitronBold",
    fontSize: 11,
    fontWeight: "700",
  },
});

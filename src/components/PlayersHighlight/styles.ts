import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 20,
    gap: 12,
  },
  titleGradientBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  title: {
    fontSize: 12,
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    flex: 1,
  },
  viewAll: {
    fontSize: 7,
    color: "#F52E8F",
    fontFamily: "OrbitronBold",
    paddingRight: 20,
  },
  carouselContainer: {
    paddingLeft: 20,
  },
  cardSpacing: {
    marginRight: 8,
  },
  userInitial: {
    fontSize: 14,
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
  },
  avatarGradientContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userInitialOnGradient: {
    fontSize: 14,
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    position: "absolute",
  },
  username: {
    fontSize: 6,
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
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
    color: "#fff",
    fontFamily: "OrbitronBold",
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

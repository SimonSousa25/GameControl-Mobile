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
    fontWeight: "700",
    color: "#F5F7FF",
    fontFamily: "Orbitron",
    flex: 1,
  },
  viewAll: {
    fontSize: 7,
    color: "#F52E8F",
    fontWeight: "700",
    fontFamily: "Orbitron",
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
    fontWeight: "700",
    color: "#F5F7FF",
    fontFamily: "Orbitron",
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
    fontWeight: "700",
    color: "#F5F7FF",
    fontFamily: "Orbitron",
    position: "absolute",
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

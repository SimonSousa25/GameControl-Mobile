import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    textAlign: "center",
  },
});

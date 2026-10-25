import { StyleSheet } from "react-native";

/** Largura de cada coluna da grade e espaço entre elas. */
export const COLUMN_WIDTH = 250;
export const COLUMN_GAP = 12;

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  // Compensa o padding do container para a grade rolar até a borda da tela.
  grid: {
    marginHorizontal: -20,
  },
  gridContent: {
    paddingHorizontal: 20,
    gap: COLUMN_GAP,
  },
  column: {
    width: COLUMN_WIDTH,
    gap: 12,
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

import { StyleSheet } from "react-native";

const GRID_GAP = 10;

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#03070D",
  },
  headerContainer: {
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#03070D",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 229, 255, 0.08)",
  },
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#03070D",
  },
  transparent: {
    backgroundColor: "transparent",
  },

  // Título / paginação compacta
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "transparent",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
    backgroundColor: "transparent",
  },
  titleBar: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: "#F52E8F",
  },
  titleText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  subtitleText: {
    color: "#6B7280",
    fontFamily: "Orbitron",
    fontSize: 10,
    marginTop: 2,
  },
  pagerCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  pagerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    backgroundColor: "#0A0E15",
  },
  pagerButtonDisabled: {
    opacity: 0.25,
  },
  pagerLabel: {
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    color: "#F5F7FF",
  },
  pagerLabelActive: {
    color: "#F52E8F",
  },
  pagerLabelMuted: {
    color: "#6B7280",
  },

  // Grid
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },

  // Estados
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
    paddingBottom: 120,
    backgroundColor: "transparent",
  },
  stateText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F52E8F",
  },
  retryButtonText: {
    color: "#F52E8F",
    fontFamily: "OrbitronBold",
    fontSize: 12,
  },

  // Paginação inferior
  footerPagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  footerNavButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    backgroundColor: "#0A0E15",
  },
  footerNavButtonDisabled: {
    opacity: 0.25,
  },
  footerNavButtonText: {
    color: "#00E5FF",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#334056",
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F52E8F",
  },
});

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
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03070D",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(0, 229, 255, 0.25)",
    borderTopColor: "#F52E8F",
  },
  loadingText: {
    color: "#00E5FF",
    fontFamily: "Orbitron",
    fontSize: 12,
    letterSpacing: 2,
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
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
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

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#0A0E15",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlign: "center",
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
  card: {
    flex: 1 / 3,
  },
  cardCover: {
    position: "relative",
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    backgroundColor: "#0A0E15",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: "45%",
  },
  cardCaption: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
  },
  cardAccentLine: {
    height: 2,
    width: "40%",
    borderRadius: 2,
    backgroundColor: "#F52E8F",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },

  // Paginação inferior
  footerPagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingVertical: 20,
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

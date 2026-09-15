import { StyleSheet } from "react-native";

const GRID_GAP = 12;

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
  scrollContent: {
    paddingBottom: 110,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E51580",
  },
  createButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#E51580",
  },
  createButtonText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    fontWeight: "700",
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

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 40,
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

  // Card da playlist atual
  playlistCard: {
    marginHorizontal: 20,
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    padding: 16,
  },
  playlistCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playlistLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  playlistLabel: {
    color: "#758096",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  playlistLabelBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
  },
  playlistActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    backgroundColor: "#03070D",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(229, 21, 34, 0.4)",
    backgroundColor: "#03070D",
  },
  playlistTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  titleBar: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: "#F52E8F",
  },
  playlistTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 20,
    fontWeight: "700",
  },
  playlistGameCount: {
    color: "#F52E8F",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
    marginTop: 6,
  },
  playlistGenre: {
    color: "#CBD2DF",
    fontFamily: "Orbitron",
    fontSize: 12,
    marginTop: 2,
  },
  playlistDivider: {
    height: 1,
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    marginVertical: 14,
  },

  // Pager entre playlists
  pagerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  addGameButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#E51580",
  },
  addGameButtonText: {
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    fontWeight: "600",
  },
  pagerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  pagerButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    backgroundColor: "#03070D",
  },
  pagerButtonDisabled: {
    opacity: 0.25,
  },
  pagerLabel: {
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    color: "#F5F7FF",
  },

  // Cabeçalho da seção de jogos
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  sectionTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionCount: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 12,
  },

  // Grid de jogos
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    rowGap: GRID_GAP,
  },
  card: {
    width: "48%",
    marginBottom: GRID_GAP,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    backgroundColor: "#0A0E15",
  },
  cardCover: {
    width: "100%",
    aspectRatio: 3 / 4,
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
  cardBody: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  cardTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(229, 21, 34, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(229, 21, 34, 0.4)",
  },
  removeButtonText: {
    color: "#FF4D5E",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    fontWeight: "600",
  },

  gamesPagerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 4,
    paddingBottom: 8,
  },
});

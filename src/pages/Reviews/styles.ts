import { StyleSheet } from "react-native";

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
  },
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 110,
  },

  gameBar: {
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  gameBarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  gameBarTitleWrap: {
    flex: 1,
  },
  gameBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },
  gameBarRating: {
    alignItems: "flex-end",
    gap: 2,
  },
  gameBarRatingValue: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },
  gameBarStars: {
    flexDirection: "row",
    gap: 2,
  },
  gameBarRatingCount: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  errorText: {
    color: "#A0A0A0",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  section: {
    marginBottom: 28,
  },
  ratingCard: {
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  sectionGradientBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },
  sectionCount: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },

  myStarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  commentInput: {
    minHeight: 90,
    backgroundColor: "#0A0E15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F52E8F",
    borderRadius: 24,
    paddingVertical: 14,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 32,
  },
  emptyText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlign: "center",
  },

  reviewCard: {
    backgroundColor: "#0A0E15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  reviewHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  reviewUsername: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#00E5FF",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },
  reviewText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#A0A0A0",
    fontFamily: "Orbitron",
  },
});

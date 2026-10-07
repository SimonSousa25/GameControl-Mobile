import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0A0E15",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#F52E8F",
  },
  title: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 16,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#051124",
    borderWidth: 1,
    borderColor: "#3E4E66",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: "#F5F7FF",
    fontSize: 14,
  },
  list: {
    maxHeight: 320,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 229, 255, 0.08)",
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03070D",
  },
  rowAvatarImage: {
    width: "100%",
    height: "100%",
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
  },
  rowSubtitle: {
    color: "#758096",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
  },
  stateContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  stateText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlign: "center",
  },
});

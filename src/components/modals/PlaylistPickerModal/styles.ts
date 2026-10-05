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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F52E8F",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 14,
  },
  createButtonText: {
    color: "#F52E8F",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
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
  rowDisabled: {
    opacity: 0.6,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#051124",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    color: "#F5F7FF",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
  },
  rowSubtitle: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
    marginTop: 2,
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

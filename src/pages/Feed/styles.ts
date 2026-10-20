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
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  titleTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F5F7FF",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },
  container: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  sectionSort: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },
  hideOwnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 14,
  },
  hideOwnLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
  },
  hideOwnSwitch: {
    transform: [{ scale: 0.75 }],
  },
  stateContainer: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 40,
  },
  stateText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});

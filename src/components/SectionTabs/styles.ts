import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 229, 255, 0.08)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: "#F52E8F",
  },
  label: {
    color: "#6B7280",
    fontFamily: "OrbitronBold",
    fontSize: 12,
    fontWeight: "700",
  },
  labelActive: {
    color: "#F5F7FF",
  },
});

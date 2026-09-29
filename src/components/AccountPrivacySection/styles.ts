import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#060B14",
  },
  header: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  headerIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F43B97",
    backgroundColor: "#31041A",
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
  subtitle: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#123048",
  },
  settingRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#123048",
  },
  settingIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#101B26",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 10,
  },
  settingStatus: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    marginTop: 4,
  },
  switch: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
  },
  informationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 16,
  },
  informationText: {
    flex: 1,
    gap: 8,
  },
  description: {
    color: "#9AA4B5",
    fontFamily: "OrbitronMedium",
    fontSize: 8,
    lineHeight: 13,
  },
  note: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    lineHeight: 12,
  },
});

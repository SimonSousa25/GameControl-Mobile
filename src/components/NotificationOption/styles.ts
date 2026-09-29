import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#123048",
  },
  iconContainer: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#101B26",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 10,
  },
  description: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    marginTop: 4,
  },
  switch: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
  },
});

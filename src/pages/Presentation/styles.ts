import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#03070D",
  },
  canvas: {
    width: 402,
    height: 874,
    backgroundColor: "#03070D",
  },
  brand: {
    position: "absolute",
    top: 255,
    left: 54,
    width: 294,
    height: 182,
  },
  logo: {
    position: "absolute",
    top: 0,
    left: 73,
    width: 148,
    height: 123,
  },
  game: {
    position: "absolute",
    top: 132,
    left: 0,
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 40,
    fontWeight: "500",
    lineHeight: 50,
    includeFontPadding: false,
  },
  control: {
    position: "absolute",
    top: 132,
    left: 129,
    color: "#E51580",
    fontFamily: "OrbitronMedium",
    fontSize: 40,
    fontWeight: "500",
    lineHeight: 50,
    includeFontPadding: false,
  },
});

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    maxWidth: 402,
    minHeight: 874,
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "#03070D",
  },
  movingBrand: {
    position: "absolute",
    top: 255,
    left: "50%",
    zIndex: 1,
    width: 294,
    height: 182,
    marginLeft: -147,
  },
  // O primeiro layout fica invisível para impedir o flash da fonte padrão.
  brandHidden: {
    opacity: 0,
  },
  movingBrandIcon: {
    position: "absolute",
    top: 0,
    left: 73,
    width: 148,
    height: 123,
  },
  movingBrandGame: {
    position: "absolute",
    top: 132,
    left: 0,
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 40,
    lineHeight: 50,
    includeFontPadding: false,
  },
  movingBrandControl: {
    position: "absolute",
    top: 132,
    left: 129,
    color: "#E51580",
    fontFamily: "OrbitronMedium",
    fontSize: 40,
    lineHeight: 50,
    includeFontPadding: false,
  },
  brandPlaceholder: {
    width: 148,
    height: 92,
    marginTop: 75,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 23,
  },
});

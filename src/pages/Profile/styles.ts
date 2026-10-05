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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 229, 255, 0.08)",
  },
  content: {
    flex: 1,
    maxWidth: 402,
    alignSelf: "center",
    width: "100%",
  },
  pager: {
    flex: 1,
  },
  // Espaço extra no fim para o conteúdo não ficar atrás da NavBottom.
  pageContent: {
    paddingBottom: 110,
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
});

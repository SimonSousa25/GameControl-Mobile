import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#03070D",
  },
  headerContainer: {
    width: "100%",
    maxWidth: 402,
    alignSelf: "center",
    backgroundColor: "#03070D",
  },
  scrollContent: {
    width: "100%",
    maxWidth: 402,
    alignSelf: "center",
    paddingHorizontal: 26,
    paddingTop: 18,

    paddingBottom: 160, // Cria espaço extra no final da rolagem.
    gap: 18
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#03070D"
  },
  titleText: {
    backgroundColor: "transparent",
  },
  title: {
    color: "#FF2DA1",
    fontFamily: "OrbitronBold",
    fontSize: 18,
    backgroundColor: "#03070D"
  },
  subtitle: {
    color: "#758096",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
    marginTop: 4,
    backgroundColor: "#03070D"
  },
  card: {
    padding: 22,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#060B14",
  },
  sectionTitle: {
    color: "#CBD2DF",
    fontFamily: "OrbitronBold",
    fontSize: 11,
  },
  avatarButton: {
    width: 76,
    height: 76,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    backgroundColor: "#101B26",
  },
  avatarButtonDisabled: {
    opacity: 0.65,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#E51580",
  },
  photoHint: {
    color: "#6A7282",
    textAlign: "center",
    fontFamily: "OrbitronMedium",
    fontSize: 8,
  },
  label: {
    color: "#CBD2DF",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
    marginTop: 8,
  },
  input: {
    minHeight: 42,
    paddingHorizontal: 12,
    color: "#FFFFFF",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#051124",
  },
  bioInput: {
    minHeight: 96,
    paddingTop: 12,
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
  notificationSubtitle: {
    color: "#6A7282",
    fontFamily: "OrbitronMedium",
    fontSize: 7,
    marginTop: 4,
  },
  notificationsCard: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123048",
    backgroundColor: "#060B14",
  },
  notificationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 66,
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: "#060B14"
  },
  notificationsHeaderIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F43B97",
    backgroundColor: "#31041A",
  },
  notificationsHeaderText: {
    flex: 1,
    backgroundColor: "#060B14"
  },
  notificationsDivider: {
    height: 1,
    backgroundColor: "#123048",
  },
  notificationsList: {
    paddingHorizontal: 18,
    backgroundColor: "#060B14",
  },
  saveButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    backgroundColor: "#E51580",
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
  logoutButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    backgroundColor: "#F3444B",
  },
  logoutText: {
    color: "#FFFFFF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
  },
});

import { StyleSheet } from "react-native";

/** Altura mínima do card compacto com a fonte no tamanho padrão. */
export const COMPACT_MIN_HEIGHT = 158;

export const styles = StyleSheet.create({
  cardLayout: {
    width: "100%",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  cardLayoutCompact: {
    marginTop: 0,
  },
  card: {
    flex: 1,
    minWidth: 0,
    position: "relative",
    backgroundColor: "#0A0E15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    padding: 14,
  },
  // Versão para grades. A altura mínima (COMPACT_MIN_HEIGHT x escala da fonte,
  // definida no PostCard) mantém as células alinhadas, mas sem altura fixa:
  // se o texto precisar de mais espaço, o card cresce em vez de cortar o rodapé.
  cardCompact: {
    padding: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuContainer: {
    position: "relative",
    zIndex: 30,
  },
  menuButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  actionMenu: {
    position: "absolute",
    top: 48,
    right: 10,
    width: 84,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
    backgroundColor: "#0A0E15",
    zIndex: 40,
    elevation: 24,
  },
  actionMenuItem: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: 1,
    backgroundColor: "#0A0E15",
  },
  actionMenuItemActive: {
    backgroundColor: "#0568744d",
  },
  actionMenuText: {
    color: "#CBD2DF",
    fontFamily: "OrbitronMedium",
    fontSize: 10,
  },
  actionMenuTextActive: {
    color: "#FFD5DC",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03070D",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  usernameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    flexShrink: 1,
    color: "#F5F7FF",
    fontFamily: "OrbitronBold",
    fontSize: 13,
    fontWeight: "700",
  },
  ownBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(245, 46, 143, 0.15)",
  },
  ownBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: "OrbitronBold",
    color: "#F52E8F",
    letterSpacing: 0.5,
  },
  date: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 9,
  },
  content: {
    marginTop: 10,
    color: "#CBD2DF",
    fontFamily: "Orbitron",
    fontSize: 12,
    lineHeight: 18,
  },
  contentCompact: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16,
  },
  contentMenuOpen: {
    paddingRight: 104,
  },
  dateCompact: {
    marginLeft: "auto",
  },
  footerCompact: {
    marginTop: 8,
    paddingTop: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 229, 255, 0.08)",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: "#6B7280",
    fontFamily: "OrbitronMedium",
    fontSize: 11,
  },
  footerTextActive: {
    color: "#F52E8F",
  },
});

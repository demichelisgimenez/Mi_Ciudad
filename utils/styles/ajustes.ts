import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const switchColors = {
  thumbOn: colors.onAccent || "#ffffff",
  thumbOff: colors.onAccent || "#ffffff",
  trackOn: colors.trackOn || "#374151",
  trackOff: colors.trackOff || "#e5e7eb",
};

export const ajustesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#ffffff",
    paddingHorizontal: sizes.base || 20,
    paddingTop: sizes.base || 20,
  },

  title: {
    fontSize: sizes.lg || 22,
    fontWeight: "600",
    color: colors.textPrimary || "#111827",
    textAlign: "center",
    marginBottom: sizes.base || 16,
  },

  card: {
    backgroundColor: colors.surface || "#ffffff",
    borderRadius: sizes.radius ? sizes.radius * 1.2 : 16,
    borderWidth: 1,
    borderColor: colors.border || "#e5e7eb",
    padding: sizes.base || 16,
    marginBottom: sizes.base || 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sizes.sm || 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutralSoft || "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: sizes.sm || 10,
  },

  iconNeutral: {
    color: colors.iconNeutral || "#6b7280",
  },

  cardHeaderText: {
    flexShrink: 1,
  },

  cardTitle: {
    fontSize: sizes.md || 16,
    fontWeight: "600",
    color: colors.textPrimary || "#111827",
  },

  cardSubtitle: {
    marginTop: 2,
    fontSize: sizes.sm || 12,
    color: colors.textSecondary || "#6b7280",
  },

  flexSpacer: {
    flex: 1,
  },

  logoutCard: {
    backgroundColor: colors.logoutBg || "#fef2f2",
    borderColor: colors.logoutBorder || "#fecaca",
  },

  loginCard: {
    backgroundColor: colors.loginBg || "#eff6ff",
    borderColor: colors.loginBorder || "#bfdbfe",
  },

  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIconCircle: {
    backgroundColor: colors.logoutIconBg || "#fee2e2",
  },

  loginIconCircle: {
    backgroundColor: colors.loginIconBg || "#dbeafe",
  },

  iconLogin: {
    color: colors.loginIcon || "#2563eb",
  },

  iconLogout: {
    color: colors.logoutIcon || "#ef4444",
  },

  chevronLogin: {
    color: colors.loginChevron || "#93c5fd",
  },

  chevronLogout: {
    color: colors.logoutChevron || "#fca5a5",
  },

  loginTitle: {
    fontSize: sizes.md || 16,
    fontWeight: "600",
    color: colors.loginTitle || "#1d4ed8",
  },

  loginSubtitle: {
    marginTop: 2,
    fontSize: sizes.sm || 12,
    color: colors.loginSubtitle || "#3b82f6",
  },

  logoutTitle: {
    fontSize: sizes.md || 16,
    fontWeight: "600",
    color: colors.logoutTitle || "#b91c1c",
  },

  logoutSubtitle: {
    marginTop: 2,
    fontSize: sizes.sm || 12,
    color: colors.logoutSubtitle || "#ef4444",
  },
});

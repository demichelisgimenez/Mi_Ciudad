import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const drawerStyles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 0.5,
    borderColor: colors.border || "#ddd",
    marginTop: sizes.xs || 8,
    paddingBottom: sizes.sm || 12,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: sizes.base || 16,
  },
  footerIconActive: {
    color: colors.success || "#2e7d32",
    marginRight: 12,
  },
  footerIconInactive: {
    color: colors.textSecondary || "#616161",
    marginRight: 12,
  },
  footerText: {
    fontSize: sizes.md || 15,
    color: colors.textPrimary || "#1b1a1f",
  },
  footerMetaContainer: {
    alignItems: "center",
    paddingHorizontal: sizes.base || 16,
    paddingTop: sizes.xs || 8,
  },
  footerLogo: {
    width: 56,
    height: 56,
    marginBottom: 4,
    opacity: 0.9,
  },
  footerAppName: {
    fontSize: sizes.sm || 13,
    fontWeight: "600",
    color: colors.textSecondary || "#444",
  },
  footerDevelopers: {
    fontSize: sizes.xs || 12,
    textAlign: "center",
    marginTop: 2,
    color: colors.textSecondary || "#666",
  },
});

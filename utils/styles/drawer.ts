import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const drawerStyles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 0.5,
    borderColor: colors.border || "#ddd",
    marginTop: sizes.xs || 8,
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
});

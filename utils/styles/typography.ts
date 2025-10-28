import { StyleSheet } from "react-native";
import { sizes, colors } from "@utils";

export const typo = StyleSheet.create({
  title: {
    fontSize: sizes.lg || 22,
    fontWeight: "700",
    color: colors.primary || "#1e3a8a",
  },
  titleCenter: { textAlign: "center" },
  body: { fontSize: sizes.md || 16, color: colors.textPrimary || "#222" },
  link: { fontSize: sizes.sm || 14, color: colors.primary || "#1e3a8a", textAlign: "center" },
  caption: { fontSize: sizes.xs || 12, color: colors.textSecondary || "#666" },
});

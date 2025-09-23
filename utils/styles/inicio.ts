import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const inicioStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.base || 16,
    backgroundColor: colors.background || "#f1f1f1ff",
  },
  weatherCard: {
    padding: sizes.base || 16,
    borderRadius: sizes.radius || 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface || "#17181aff",
    marginBottom: sizes.base || 16,
  },
  weatherTitle: {
    fontSize: sizes.md || 16,
    fontWeight: "bold",
    color: colors.textPrimary || "#ffffffff",
  },
  weatherSubtitle: {
    fontSize: sizes.sm || 14,
    color: colors.textSecondary || "#b8b8b8ff",
  },
  weatherTemp: {
    fontSize: sizes.xl || 28,
    fontWeight: "bold",
    color: colors.textPrimary || "#ffffffff",
  },
  title: {
    fontSize: sizes.lg || 18,
    fontWeight: "bold",
    marginBottom: sizes.base || 16,
    color: colors.textPrimary || "#1b1a1fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: colors.primary || "#1b1a1fff",
    width: "48%",
    borderRadius: sizes.radius || 12,
    padding: sizes.base || 16,
    marginBottom: sizes.base || 16,
  },
  cardTitle: {
    fontSize: sizes.md || 16,
    fontWeight: "bold",
    color: colors.onPrimary || "#fff",
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: sizes.sm || 12,
    color: colors.onPrimaryVariant || "#e0e0e0",
  },
});

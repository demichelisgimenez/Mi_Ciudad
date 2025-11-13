import { StyleSheet } from "react-native";
import { sizes, colors } from "@utils";

export const inicioStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.base || 16,
    backgroundColor: colors.background || "#f1f1f1ff",
  },

  weatherCard: {
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 5,
  },

  weatherLeftModern: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  weatherTitleModern: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  weatherSubtitleModern: {
    fontSize: 14,
    color: "#ffffffdd",
  },

  weatherTempModern: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    minWidth: 70,
    textAlign: "right",
  },

  weatherExpandedBox: {
    backgroundColor: "#F4F7FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -8,
    marginBottom: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ffffff66",
  },

  chip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#E1ECFF",
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  chipText: {
    fontSize: 13,
    color: "#163560",
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

  safeArea: { flex: 1 },

  icon: { color: "#fff" },

  weatherTextCol: {
    flex: 1,
    minWidth: 0,
  },
});

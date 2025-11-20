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

  usefulPhonesButton: {
    marginTop: 12,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizes.radius || 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.primary || "#1a465aff",
  },

  usefulPhonesButtonIcon: {
    color: colors.onPrimary || "#fff",
    marginRight: 8,
  },

  usefulPhonesButtonText: {
    color: colors.onPrimary || "#fff",
    fontSize: sizes.md || 16,
    fontWeight: "600",
  },

  usefulPhonesCard: {
    marginTop: 8,
    borderRadius: sizes.radius || 12,
    backgroundColor: colors.surface || "#ffffff",
    padding: 14,
  },

  phonesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  phonesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  phonesHeroIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary || "#1a465aff",
    marginRight: 8,
  },

  phonesHeroIcon: {
    color: colors.onPrimary || "#fff",
  },

  phonesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary || "#1b1a1fff",
  },

  phonesSubtitle: {
    fontSize: 12,
    color: colors.textSecondary || "#6c6c6cff",
  },

  usefulPhonesCategoryBlock: {
    marginBottom: 12,
  },

  usefulPhonesCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  usefulPhonesCategoryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  categoryIconEmergencias: { backgroundColor: "#b91c1c" },
  categoryIconSalud: { backgroundColor: "#16a34a" },
  categoryIconSeguridad: { backgroundColor: "#1d4ed8" },
  categoryIconMunicipio: { backgroundColor: "#6b7280" },
  categoryIconTransporte: { backgroundColor: "#f97316" },
  categoryIconTramites: { backgroundColor: "#6366f1" },
  categoryIconDefault: { backgroundColor: "#444" },

  usefulPhonesCategoryIconSymbol: {
    color: "#fff",
  },

  usefulPhonesCategoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary || "#1b1a1fff",
  },

  usefulPhonesItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  usefulPhonesItemTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },

  usefulPhonesItemLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary || "#1b1a1fff",
  },

  usefulPhonesItemDescription: {
    fontSize: 11,
    color: colors.textSecondary || "#6c6c6cff",
  },

  usefulPhonesItemRight: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.primary || "#1a465aff",
    minWidth: 140,
    flexShrink: 0,
    justifyContent: "center",
  },

  usefulPhonesItemPhone: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.onPrimary || "#ffffff",
    marginRight: 4,
  },

  usefulPhonesCallIcon: {
    color: colors.onPrimary || "#ffffff",
  },
});

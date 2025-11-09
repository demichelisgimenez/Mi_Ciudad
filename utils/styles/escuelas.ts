import { StyleSheet } from "react-native";
import { sizes } from "../../utils";
import { materialColors } from "@utils/colors";

const levelColor = {
  Inicial: "#E91E63",
  Primaria: "#2196F3",
  Secundaria: "#4CAF50",
  Técnica: "#FF9800",
  Superior: "#9C27B0",
  Especial: "#00BCD4",
  Adultos: "#795548",
} as const;

export const escuelaStyles = Object.assign(
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: materialColors.schemes.dark.background,
    },

    map: { flex: 1, width: "100%" },

    headerOverlay: {
      position: "absolute",
      top: 8,
      left: 12,
      right: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    headerTitle: {
      fontSize: sizes.titulo,
      fontWeight: "800",
      color: "#fff",
    },

    bottomSheet: {
      position: "absolute",
      left: 0, right: 0, bottom: 0,
      backgroundColor: materialColors.schemes.dark.surface,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: 1,
      borderColor: materialColors.schemes.dark.outlineVariant,
      paddingBottom: 10,
      elevation: 14,
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -3 },
    },

    filtersRow: {
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 6,
      flexDirection: "row",
      alignItems: "center",
    },
    chipsRow: { gap: 8, paddingVertical: 4, flexGrow: 1 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: materialColors.schemes.dark.outline,
      backgroundColor: materialColors.schemes.dark.surface,
      marginRight: 8,
    },
    chipActive: {
      borderColor: materialColors.schemes.dark.primary,
      backgroundColor: materialColors.schemes.dark.primaryContainer,
    },
    chipText: { color: materialColors.schemes.dark.onSurface, fontWeight: "600" },
    chipTextActive: { color: materialColors.schemes.dark.onPrimaryContainer },

    searchInput: {
      marginTop: 4,
      marginHorizontal: 14,
      backgroundColor: materialColors.schemes.dark.surface,
      borderWidth: 1,
      borderColor: materialColors.schemes.dark.outlineVariant,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: materialColors.schemes.dark.onSurface,
    },

    listContent: { paddingHorizontal: 8, paddingBottom: 12 },
    card: {
      backgroundColor: materialColors.schemes.dark.surface,
      padding: 12,
      marginTop: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: materialColors.schemes.dark.outlineVariant,
    },
    cardActive: { borderColor: materialColors.schemes.dark.primary },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
    levelDot: { width: 10, height: 10, borderRadius: 5 },
    nombre: { fontSize: 16, fontWeight: "700", color: materialColors.schemes.dark.onSurface, flexShrink: 1 },
    direccion: { fontSize: 13, color: materialColors.schemes.dark.onSurfaceVariant, marginBottom: 8 },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    pillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    metaText: { color: materialColors.schemes.dark.onSurfaceVariant, fontSize: 12 },

    detailBox: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: materialColors.schemes.dark.outlineVariant,
      gap: 4,
    },
    detailLine: {
      color: materialColors.schemes.dark.onSurface,
      fontSize: 12.5,
    },
    detailActions: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: materialColors.schemes.dark.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    backBtnText: {
      color: materialColors.schemes.dark.onPrimary,
      fontWeight: "700",
      fontSize: 12.5,
    },

    errorText: { color: materialColors.schemes.dark.error, textAlign: "center", marginTop: 8 },
  }),
  { levelColor }
);

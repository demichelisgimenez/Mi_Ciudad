import { StyleSheet } from "react-native";
import { sizes } from "@utils/sizes";
import { materialColors } from "@utils/colors";

export const farmaciaStyles = StyleSheet.create({
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
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: materialColors.schemes.dark.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: materialColors.schemes.dark.outlineVariant,
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    overflow: "hidden",
  },


  dragHitbox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    zIndex: 10,
  },

  dragStrip: {
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  handleBar: {
    width: 56,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.45)",
  },


  filtersRow: {
    paddingHorizontal: 14,
    paddingTop: 6,
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

  listWrapper: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 8, paddingBottom: 12 },

  emptyContainer: {
    paddingVertical: 24,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#A9A9A9",
    fontStyle: "italic",
    textAlign: "center",
  },

  card: {
    backgroundColor: materialColors.schemes.dark.surface,
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: materialColors.schemes.dark.outlineVariant,
  },
  cardActive: { borderColor: materialColors.schemes.dark.primary },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  cardIcon: { width: 18, height: 18 },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: materialColors.schemes.dark.onSurface,
    flexShrink: 1,
  },
  cardAddress: {
    fontSize: 13,
    color: materialColors.schemes.dark.onSurfaceVariant,
    marginBottom: 6,
  },
  cardMeta: {
    color: materialColors.schemes.dark.onSurfaceVariant,
    fontSize: 12,
  },

  pillOpen: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1DB954",
    marginLeft: "auto",
  },
  pillClosed: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: materialColors.schemes.dark.error,
    marginLeft: "auto",
  },
  pillText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  detailContainer: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: materialColors.schemes.dark.outlineVariant,
    gap: 4,
  },
  detailLine: {
    color: materialColors.schemes.dark.onSurface,
    fontSize: 12.5,
  },

  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: materialColors.schemes.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    color: materialColors.schemes.dark.onPrimary,
    fontWeight: "700",
    fontSize: 12.5,
  },

  markerContainerDefault: {
    width: 32,
    height: 32,
  },
  markerContainerSelected: {
    width: 40,
    height: 40,
  },
  markerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  errorText: {
    color: materialColors.schemes.dark.error,
    textAlign: "center",
    marginTop: 8,
  },
});

import { StyleSheet } from "react-native";
import { sizes, colors } from "@utils";

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: sizes.base || 20 },
  formWrapper: { width: "100%", maxWidth: 520, alignSelf: "center" },

  centerY: { justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  mtXs: { marginTop: sizes.xs || 6 },
  mtSm: { marginTop: sizes.sm || 10 },
  mtMd: { marginTop: sizes.base || 16 },
  mtLg: { marginTop: sizes.lg || 20 },
  pbLg: { paddingBottom: sizes.lg || 20 },
});

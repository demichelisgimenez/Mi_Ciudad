import { StyleSheet } from "react-native";
import { sizes, colors } from "@utils";

export const forms = StyleSheet.create({
  input: {
    backgroundColor: colors.surface || "#fff",
    borderWidth: 1,
    borderColor: colors.border || "#ddd",
    borderRadius: sizes.radius || 10,
    padding: sizes.sm || 10,
  },
  inputRow: {
    backgroundColor: colors.surface || "#fff",
    borderWidth: 1,
    borderColor: colors.border || "#ddd",
    borderRadius: sizes.radius || 10,
    paddingHorizontal: sizes.sm || 10,
    paddingVertical: (sizes.sm || 10) - 2,
    flexDirection: "row",
    alignItems: "center",
  },
});

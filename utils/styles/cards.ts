import { StyleSheet } from "react-native";
import { sizes, colors } from "@utils";

export const cards = StyleSheet.create({
  card: {
    backgroundColor: colors.surface || "#fff",
    borderWidth: 1,
    borderColor: colors.border || "#ddd",
    borderRadius: sizes.radius || 12,
    padding: sizes.sm || 12,
  },
  elevated: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

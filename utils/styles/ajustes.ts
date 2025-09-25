import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const ajustesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#f9f9f9",
    padding: sizes.base || 20,
  },
  title: {
    fontSize: sizes.lg || 22,
    fontWeight: "bold",
    marginBottom: sizes.base || 20,
    color: colors.primary || "#1e1f20ff",
    textAlign: "center",
  },
  section: {
    backgroundColor: colors.surface || "#fff",
    padding: sizes.base || 15,
    borderRadius: sizes.radius || 12,
    marginBottom: sizes.base || 20,
    borderWidth: 1,
    borderColor: colors.border || "#ddd",
  },
  sectionTitle: {
    fontSize: sizes.md || 18,
    fontWeight: "bold",
    marginBottom: sizes.sm || 10,
    color: colors.textPrimary || "#1b1a1fff",
  },
  input: {
    backgroundColor: colors.surface || "#fff",
    padding: sizes.sm || 10,
    borderRadius: sizes.radius || 10,
    borderWidth: 1,
    borderColor: colors.border || "#ccc",
    marginBottom: sizes.sm || 10,
  },
  button: {
    backgroundColor: colors.primary || "#212224ff",
    paddingVertical: sizes.sm || 10,
    paddingHorizontal: sizes.base || 15,
    borderRadius: sizes.radius || 10,
    alignItems: "center",
  },
  buttonText: {
    color: colors.onPrimary || "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: sizes.sm || 10,
  },
  label: {
    fontSize: sizes.md || 16,
    color: colors.textPrimary || "#333",
  },
});

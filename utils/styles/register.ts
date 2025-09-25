import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background || "#f9f9f9",
    padding: sizes.base || 20,
  },
  title: {
    fontSize: sizes.lg || 24,
    fontWeight: "bold",
    marginBottom: sizes.base || 30,
    color: colors.primary || "#1e3a8a",
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface || "#fff",
    padding: sizes.sm || 12,
    borderRadius: sizes.radius || 10,
    borderWidth: 1,
    borderColor: colors.border || "#ccc",
    marginBottom: sizes.base || 15,
  },
  button: {
    backgroundColor: colors.primary || "#121213ff",
    paddingVertical: sizes.sm || 12,
    borderRadius: sizes.radius || 10,
    alignItems: "center",
    marginBottom: sizes.base || 20,
  },
  buttonText: {
    color: colors.onPrimary || "#fff",
    fontWeight: "bold",
    fontSize: sizes.md || 16,
  },
  linkButton: {
    alignItems: "center",
    marginBottom: sizes.sm || 10,
  },
  linkText: {
    fontSize: sizes.sm || 14,
    color: colors.textSecondary || "#555",
    textDecorationLine: "underline",
  },
});

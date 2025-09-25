import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const notasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#f9f9f9",
    padding: sizes.base || 20,
  },
  title: {
    fontSize: sizes.lg || 22,
    fontWeight: "bold",
    marginBottom: sizes.base || 15,
    color: colors.primary || "#1e3a8a",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: sizes.base || 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface || "#fff",
    padding: sizes.sm || 10,
    borderRadius: sizes.radius || 10,
    borderWidth: 1,
    borderColor: colors.border || "#ccc",
  },
  addButton: {
    backgroundColor: colors.primary || "#27282cff",
    paddingVertical: sizes.sm || 10,
    paddingHorizontal: sizes.base || 15,
    borderRadius: sizes.radius || 10,
    marginLeft: sizes.sm || 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.onPrimary || "#fff",
    fontWeight: "bold",
  },
  notesList: {
    marginTop: sizes.sm || 10,
  },
  noteCard: {
    backgroundColor: colors.surface || "#fff",
    padding: sizes.base || 15,
    borderRadius: sizes.radius || 10,
    marginBottom: sizes.sm || 10,
    borderWidth: 1,
    borderColor: colors.border || "#ddd",
  },
  noteText: {
    fontSize: sizes.md || 16,
    color: colors.textPrimary || "#333",
  },
  noteImage: {
    width: "100%",
    height: 180,
    borderRadius: sizes.radius || 10,
    marginTop: sizes.sm || 10,
  },
});

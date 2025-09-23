import { StyleSheet } from "react-native";
import { sizes } from "../../utils";
import { materialColors } from "@utils/colors";

export const escuelaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: materialColors.schemes.light.background,
    padding: 16,
  },
  titulo: {
    fontSize: sizes.titulo,
    fontWeight: "bold",
    marginBottom: 12,
    color: materialColors.schemes.light.primary,
  },
  card: {
    backgroundColor: materialColors.schemes.light.surface,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
    color: materialColors.schemes.light.onSurface,
  },
  direccion: {
    fontSize: 14,
    color: materialColors.schemes.light.onSurfaceVariant,
    marginBottom: 8,
  },
});

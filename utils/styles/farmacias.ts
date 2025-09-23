import { StyleSheet } from "react-native";
import { sizes } from "../../utils";
import { materialColors } from "@utils/colors";

export const farmaciasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: materialColors.schemes.dark.background,
    padding: 16,
  },
  titulo: {
    fontSize: sizes.titulo,
    fontWeight: "bold",
    marginBottom: 12,
    color: materialColors.schemes.dark.primary,
  },
  card: {
    backgroundColor: materialColors.schemes.dark.surface,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
    color: materialColors.schemes.dark.onSurface,
  },
  direccion: {
    fontSize: 14,
    color: materialColors.schemes.dark.onSurfaceVariant,
    marginBottom: 8,
  },
});

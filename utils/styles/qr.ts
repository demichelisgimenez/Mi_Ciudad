import { StyleSheet } from "react-native";
import { materialColors } from "@utils/colors";

export const qrStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  text: {
    color: materialColors.schemes.light.onSurface, // texto claro
    fontWeight: "bold",
    marginBottom: 5,
  },
  link: {
    color: materialColors.schemes.light.primary, // usamos tu color primario
    marginBottom: 10,
  },
});

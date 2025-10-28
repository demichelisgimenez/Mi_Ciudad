// @utils/styles/radios.ts
import { StyleSheet } from "react-native";
import { colors } from "@utils/colors";



export const radiosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor ?? "#fff",
    padding: 20,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(25, 26, 105, 0.9)",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(22, 22, 22, 1)",
  },

  // Card principal
  card: {
    backgroundColor: "rgba(15, 15, 15, 1)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(5, 5, 5, 0.2)",
  },
  frequency: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(68, 199, 239, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    marginRight: 6,
    backgroundColor: "#ef4444",
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  // Controles
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(26, 25, 25, 0.11)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(34,197,94,0.3)",
    borderWidth: 2,
    borderColor: "rgba(34,197,94,0.5)",
  },

  // Lista de emisoras
  presets: {
    backgroundColor: "rgba(223, 221, 221, 1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 40,
  },
  presetsLabel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "black",
    marginBottom: 20,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 5,
  },
  presetBtn: {
    flexBasis: "48%",
    backgroundColor: "rgba(22, 21, 21, 0.97)", // negro
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
 presetBtnActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.6)",
  },
  presetText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  presetName: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 1)",
  },
  presetTextActive: { color: "#0B0B0B" },
  presetNameActive: { color: "#0B0B0B" },
  // Filtros
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: "600",
    marginBottom: 6,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  chipActive: {
    borderColor: "rgba(34,197,94,0.7)",
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  chipInactive: {
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "transparent",
  },
  
});

import { StyleSheet } from "react-native";
import { colors } from "@utils/colors";

export const radiosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor ?? "#fff",
  },

  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  headerTop: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "rgba(25, 26, 105, 0.9)",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(22, 22, 22, 1)",
  },

  card: {
    backgroundColor: "rgba(15, 15, 15, 1)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
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

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
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

  presetsHeader: {
    backgroundColor: "rgba(223, 221, 221, 1)",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  presetsLabel: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "black",
  },

  presetBtn: {
    flexBasis: "48%",
    backgroundColor: "rgba(22, 21, 21, 0.97)",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  presetBtnActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.6)",
  },
  presetBtnDisabled: {
    opacity: 0.6,
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
  presetImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginBottom: 8,
  },
  presetUnavailable: {
    marginTop: 4,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  centerText: {
    textAlign: "center",
  },

  /* Mini Player */
  miniPlayerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: 12,
  },
  miniPlayer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(223, 221, 221, 1)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    maxWidth: 600,
  },
  miniPlayerTitle: {
    color: "#0B0B0B",
    fontSize: 14,
    fontWeight: "700",
  },
  miniPlayerSubtitle: {
    color: "rgba(0,0,0,0.55)",
    fontSize: 12,
    marginTop: 2,
  },
  miniIconBtn: {
    marginHorizontal: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  miniPlayBtn: {
    marginHorizontal: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,197,94,0.65)",
  },
  miniPlayBtnActive: {
    backgroundColor: "rgba(34,197,94,0.85)",
  },
  miniCloseBtn: {
    marginLeft: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  stickyHeader: {
    backgroundColor: colors.backgroundColor ?? "#fff",
    paddingTop: 8,
  },
  miniOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  miniDraggable: {
    position: "absolute",
    maxWidth: 600,
  },
});

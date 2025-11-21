import { StyleSheet } from "react-native";
import { colors, sizes } from "@utils";

export const sobreMiCiudadStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background || "#f1f1f1", // igual que Inicio
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background || "#f1f1f1",
  },
  content: {
    paddingHorizontal: sizes.base || 16,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // 🔹 Tarjetas ajustadas, más tipo componente de Inicio
  block: {
    backgroundColor: "#FFFFFF", // tarjeta clara
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,

    // Separación visual bien clara
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,

    // Para que no “bordeeborde”
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary || "#111111",
    textAlign: "center",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary || "#4b5563",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary || "#111111",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary || "#111827",
    marginBottom: 4,
  },
  sectionTextHighlight: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary || "#4b5563",
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: colors.textPrimary || "#111827",
    textAlign: "center",
  },
  academicBox: {
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.textPrimary || "#111111",
    paddingLeft: 10,
  },
  academicLabel: {
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  academicValue: {
    fontSize: 13,
    color: colors.textPrimary || "#111827",
    marginTop: 2,
  },

  videoButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  videoButtonIcon: {
    fontSize: 18,
    color: "#ffffff",
    marginRight: 8,
  },
  videoButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },

  footer: {
    paddingTop: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary || "#4b5563",
    textAlign: "center",
  },
});

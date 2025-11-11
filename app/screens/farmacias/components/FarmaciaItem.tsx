import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";
import { isOpenAt, todayLabel } from "../types";
import type { Pharmacy } from "../types";

export default React.memo(function FarmaciaItem({
  item,
  active,
  onPress,
  onCall,
  onNavigate,
  onBack,
}: {
  item: Pharmacy;
  active: boolean;
  onPress: () => void;
  onCall: () => void;
  onNavigate: () => void;
  onBack: () => void;
}) {
  const open = isOpenAt(item.hours);
  return (
    <TouchableOpacity style={[styles.card, active && styles.cardActive]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <Image source={require("../../../../assets/pins/pin-farmacia.png")} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={open ? styles.pillOpen : styles.pillClosed}>
          <Text style={styles.pillText}>{open ? "Abierto" : "Cerrado"}</Text>
        </View>
      </View>
      {!!item.address && <Text style={styles.cardAddress}>📍 {item.address}</Text>}
      {!!item.phone && <Text style={styles.cardMeta}>📞 {item.phone}</Text>}
      <Text style={styles.cardMeta}>{todayLabel(item.hours ?? undefined)}</Text>
      {active && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLine}>
            Lunes a viernes: {(item.hours?.weekday ?? []).map((r) => `${r.from}–${r.to}`).join("  ·  ") || "—"}
          </Text>
          <Text style={styles.detailLine}>
            Sábado: {(item.hours?.saturday ?? []).map((r) => `${r.from}–${r.to}`).join("  ·  ") || "—"}
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onCall} activeOpacity={0.9}>
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onNavigate} activeOpacity={0.9}>
              <Ionicons name="navigate" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Cómo llegar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onBack} activeOpacity={0.9}>
              <Ionicons name="arrow-back" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});


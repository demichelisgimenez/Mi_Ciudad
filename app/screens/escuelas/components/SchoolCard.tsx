import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { escuelaStyles as styles } from "@utils/styles/escuelas";
import type { School } from "../types";

export function SchoolCard({
  item,
  active,
  onPress,
  onCall,
  onNavigate,
  onBack,
}: {
  item: School;
  active: boolean;
  onPress: () => void;
  onCall: () => void;
  onNavigate: () => void;
  onBack: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, active && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.levelDot,
            // @ts-ignore (está exportado en los estilos)
            { backgroundColor: (styles as any).levelColor[item.level] },
          ]}
        />
        <Text style={styles.nombre}>{item.name}</Text>
      </View>

      {!!item.address && (
        <Text style={styles.direccion}>
          📍 {item.address}
          {item.city ? `, ${item.city}` : ""}
        </Text>
      )}

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.pill,
            // @ts-ignore
            { backgroundColor: (styles as any).levelColor[item.level] },
          ]}
        >
          <Text style={styles.pillText}>{item.level}</Text>
        </View>
        <Text style={styles.metaText}>{item.phone ? `📞 ${item.phone}` : ""}</Text>
      </View>

      {active && (
        <View style={styles.detailBox}>
          {item.cue ? <Text style={styles.detailLine}>CUE: {item.cue}</Text> : null}
          {item.email ? <Text style={styles.detailLine}>✉️ {item.email}</Text> : null}
          {item.phone ? <Text style={styles.detailLine}>📞 {item.phone}</Text> : null}

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onCall} activeOpacity={0.9}>
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onNavigate} activeOpacity={0.9}>
              <Ionicons name="navigate" size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Cómo llegar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onBack} activeOpacity={0.9}>
              <Ionicons name="arrow-back" size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

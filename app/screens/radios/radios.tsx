import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { radiosStyles as styles } from "@utils/styles/radios";
import { Ionicons } from "@expo/vector-icons";

export default function RadiosScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState({
    freq: 99.5,
    name: "FM Federal",
  });

  const presets = [
    { freq: 99.9, name: "FM 100 Federal" },
    { freq: 90.5, name: "Radio Integración" },
    { freq: 96.9, name: "La Nueva del Chamamé" },
    { freq: 97.9, name: "Radio Vida Federal" },
    { freq: 102.1, name: "Radio Universo" },
    { freq: 93.3, name: "Radio Venecia" },
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Ionicons name="radio-outline" size={24} color="black" /> Radio FM
        </Text>
        <Text style={styles.subtitle}>Federal, Entre Ríos</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.frequency}>{currentStation.freq}</Text>
        <Text style={styles.stationName}>{currentStation.name}</Text>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {isPlaying ? "Reproduciendo" : "Detenido"}
          </Text>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.playBtn]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Ionicons name="pause" size={32} color="white" />
          ) : (
            <Ionicons name="play" size={32} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.presets}>
        <Text style={styles.presetsLabel}>Emisoras de Federal</Text>
        <View style={styles.presetGrid}>
          {presets.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.presetBtn}
              onPress={() => setCurrentStation(p)}
            >
              <Text style={styles.presetText}>{p.freq}</Text>
              <Text style={styles.presetName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

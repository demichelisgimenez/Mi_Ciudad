import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { radiosStyles as styles } from "@utils/styles/radios";

export default function RadiosScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState({
    freq: 99.5,
    name: "FM Federal",
  });

  const presets = [
    { freq: 99.5, name: "FM Federal" },
    { freq: 101.3, name: "Radio Uno" },
    { freq: 95.7, name: "La Popular" },
    { freq: 103.9, name: "FM Litoral" },
    { freq: 97.1, name: "Radio Ciudad" },
    { freq: 105.5, name: "FM Máxima" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#667eea" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📻 Radio FM</Text>
        <Text style={styles.subtitle}>Federal, Entre Ríos</Text>
      </View>

      {/* Radio Display */}
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

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.playText}>⏮️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlBtn, styles.playBtn]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playText}>{isPlaying ? "⏸️" : "▶️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Text style={styles.playText}>⏭️</Text>
        </TouchableOpacity>
      </View>

      {/* Presets */}
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


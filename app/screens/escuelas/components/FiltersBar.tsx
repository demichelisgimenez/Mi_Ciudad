import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { escuelaStyles as styles } from "@utils/styles/escuelas";
import type { Level } from "../types";

export function FiltersBar({
  data,
  active,
  onChange,
}: {
  data: (Level | "Todos")[];
  active: Level | "Todos";
  onChange: (v: Level | "Todos") => void;
}) {
  return (
    <View style={styles.filtersRow}>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(l) => String(l)}
        renderItem={({ item }) => {
          const isActive = active === item;
          return (
            <TouchableOpacity
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChange(item)}
              activeOpacity={0.9}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

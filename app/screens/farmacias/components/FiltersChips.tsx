import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";
import type { Filter } from "../types";

export default function FiltersChips({
  value,
  onChange,
  data,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  data: readonly string[];
}) {
  return (
    <View style={styles.filtersRow}>
      <FlatList
        data={data as unknown as string[]}
        horizontal
        keyExtractor={(v) => v}
        renderItem={({ item }) => {
          const active = value === (item as Filter);
          return (
            <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={() => onChange(item as Filter)} activeOpacity={0.9}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
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


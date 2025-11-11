import React from "react";
import { View, Text } from "react-native";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";

export default function EmptyList({ loading, message }: { loading: boolean; message: string }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{loading ? "Cargando…" : message}</Text>
    </View>
  );
}


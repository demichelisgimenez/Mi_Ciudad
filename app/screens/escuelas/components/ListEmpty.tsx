import React from "react";
import { View, Text } from "react-native";
import { escuelaStyles as styles } from "@utils/styles/escuelas";

export function ListEmpty({ loading }: { loading: boolean }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? "Cargando…" : "No se encontraron escuelas con los filtros aplicados"}
      </Text>
    </View>
  );
}

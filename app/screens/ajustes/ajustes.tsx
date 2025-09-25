import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { ajustesStyles as styles } from "@utils/styles/ajustes";

export default function Ajustes() {
  const [fakeSwitch, setFakeSwitch] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Recibir notificaciones</Text>
          <Switch
            value={fakeSwitch}
            onValueChange={() => setFakeSwitch(!fakeSwitch)}
            disabled={false}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tema</Text>
        <TouchableOpacity style={styles.button} disabled={false}>
          <Text style={styles.buttonText}>Cambiar a modo oscuro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

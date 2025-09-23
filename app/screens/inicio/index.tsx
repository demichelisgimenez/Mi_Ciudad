import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TAB_ROUTES } from "@utils/constants";
import { inicioStyles as styles } from "@utils/styles/inicio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function InicioScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Clima */}
      <View style={styles.weatherCard}>
        <View>
          <Text style={styles.weatherTitle}>Clima en Federal</Text>
          <Text style={styles.weatherSubtitle}>Nublado</Text>
        </View>
        <Text style={styles.weatherTemp}>13°</Text>
      </View>

      <Text style={styles.title}>¿Qué querés hacer hoy?</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(TAB_ROUTES.FARMACIAS as never)}
        >
          <MaterialIcons name="local-pharmacy" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Farmacias</Text>
          <Text style={styles.cardSubtitle}>Mapa y contacto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(TAB_ROUTES.ESCUELAS as never)}
        >
          <MaterialIcons name="school" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Escuelas</Text>
          <Text style={styles.cardSubtitle}>Concursos y listado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(TAB_ROUTES.NOTAS as never)}
        >
          <MaterialIcons name="note-alt" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Notas</Text>
          <Text style={styles.cardSubtitle}>Foto + recordatorio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Ajustes" as never)}
        >
          <MaterialIcons name="settings" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Ajustes</Text>
          <Text style={styles.cardSubtitle}>Preferencias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

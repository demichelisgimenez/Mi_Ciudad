import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DRAWER_ROUTES } from "@utils/constants";
import { inicioStyles as styles } from "@utils/styles/inicio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";


export default function InicioScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1}} edges={["top"]}>

      <View style={styles.container}>

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
            onPress={() => navigation.navigate(DRAWER_ROUTES.FARMACIAS as never)}
          >
            <MaterialIcons name="local-pharmacy" size={32} color="#fff" />
            <Text style={styles.cardTitle}>Farmacias</Text>
            <Text style={styles.cardSubtitle}>Mapa y contactos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(DRAWER_ROUTES.ESCUELAS as never)}
          >
            <MaterialIcons name="school" size={32} color="#fff" />
            <Text style={styles.cardTitle}>Escuelas</Text>
            <Text style={styles.cardSubtitle}>Mapa y listado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(DRAWER_ROUTES.RADIOS as never)}
          >
            <MaterialIcons name="radio" size={32} color="#fff" />
            <Text style={styles.cardTitle}>Radios</Text>
            <Text style={styles.cardSubtitle}>FM en vivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(DRAWER_ROUTES.NOTAS as never)}
          >
            <MaterialIcons name="note-alt" size={32} color="#fff" />
            <Text style={styles.cardTitle}>Notas</Text>
            <Text style={styles.cardSubtitle}>Notas personales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(DRAWER_ROUTES.QR as never)}
          >
            <MaterialIcons name="qr-code-scanner" size={32} color="#fff" />
            <Text style={styles.cardTitle}>QR</Text>
            <Text style={styles.cardSubtitle}>Escanear código</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(DRAWER_ROUTES.AJUSTES as never)}
          >
            <MaterialIcons name="settings" size={32} color="#fff" />
            <Text style={styles.cardTitle}>Ajustes</Text>
            <Text style={styles.cardSubtitle}>Preferencias</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>

  );
}

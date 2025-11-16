import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { DRAWER_ROUTES } from "@utils/constants";
import { inicioStyles as styles } from "@utils/styles/inicio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherCard from "./components/WeatherCard";
import { useAuth } from "@shared/context/AuthContext";
import { colors } from "@utils";
import { useReminders } from "./hooks/use-reminders";
import RemindersBell from "./components/RemindersBell";
import RemindersList from "./components/RemindersList";

export default function InicioScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const userId = state?.user?.id ?? null;

  const {
    sortedReminders,
    loadingReminders,
    fetchReminders,
    deleteReminder,
    clearAllReminders,
    pendingCount,
  } = useReminders(userId);

  const [showReminders, setShowReminders] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <WeatherCard />

        {/* Título + campanita de recordatorios */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          <Text style={styles.title}>¿Qué querés hacer hoy?</Text>

          <RemindersBell
            userId={userId}
            pendingCount={pendingCount}
            onToggle={() => setShowReminders((v) => !v)}
          />
        </View>

        {/* Panel de recordatorios */}
        <RemindersList
          visible={!!userId && showReminders}
          userId={userId}
          loading={loadingReminders}
          reminders={sortedReminders}
          onDelete={deleteReminder}
          onClearAll={clearAllReminders}
          onPressReminder={() =>
            navigation.navigate(DRAWER_ROUTES.NOTAS as never)
          }
        />

        {/* GRID PRINCIPAL */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.FARMACIAS as never)
            }
          >
            <MaterialIcons name="local-pharmacy" size={32} style={styles.icon} />
            <Text style={styles.cardTitle}>Farmacias</Text>
            <Text style={styles.cardSubtitle}>Mapa y contactos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.ESCUELAS as never)
            }
          >
            <MaterialIcons name="school" size={32} style={styles.icon} />
            <Text style={styles.cardTitle}>Escuelas</Text>
            <Text style={styles.cardSubtitle}>Mapa y listado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.RADIOS as never)
            }
          >
            <MaterialIcons name="radio" size={32} style={styles.icon} />
            <Text style={styles.cardTitle}>Radios</Text>
            <Text style={styles.cardSubtitle}>FM en vivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.NOTAS as never)
            }
          >
            <MaterialIcons name="note-alt" size={32} style={styles.icon} />
            <Text style={styles.cardTitle}>Notas</Text>
            <Text style={styles.cardSubtitle}>Notas personales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.QR as never)
            }
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={32}
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>QR</Text>
            <Text style={styles.cardSubtitle}>Escanear código</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(DRAWER_ROUTES.AJUSTES as never)
            }
          >
            <MaterialIcons name="settings" size={32} style={styles.icon} />
            <Text style={styles.cardTitle}>Ajustes</Text>
            <Text style={styles.cardSubtitle}>Preferencias</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

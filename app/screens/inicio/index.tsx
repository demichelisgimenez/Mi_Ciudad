import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { DRAWER_ROUTES } from "@utils/constants";
import { inicioStyles as styles } from "@utils/styles/inicio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherCard from "./components/WeatherCard";
import { useAuth } from "@shared/context/AuthContext";
import { supabase } from "@utils/supabase";
import { colors } from "@utils";
import * as Notifications from "expo-notifications";

type ReminderItem = {
  id: string;
  title: string | null;
  description: string | null;
  reminder_start: string | null;
  reminder_end: string | null;
  reminder_identifier: string | null;
};

function formatRange(start: string | null, end: string | null) {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return "";
  const day = s.toLocaleDateString();
  const h1 = s.toTimeString().slice(0, 5);
  const h2 = e.toTimeString().slice(0, 5);
  return `${day} · ${h1} a ${h2} hs`;
}

function getStatus(r: ReminderItem) {
  if (!r.reminder_start || !r.reminder_end) return "programado";
  const now = Date.now();
  const s = new Date(r.reminder_start).getTime();
  const e = new Date(r.reminder_end).getTime();
  if (now < s) return "programado";
  if (now >= s && now <= e) return "activo";
  return "expirado";
}

export default function InicioScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const userId = state?.user?.id ?? null;

  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  const pendingCount = reminders.filter(
    (r) => getStatus(r) === "activo"
  ).length;

  const fetchReminders = useCallback(async () => {
    if (!userId) {
      setReminders([]);
      return;
    }
    try {
      setLoadingReminders(true);
      const { data, error } = await supabase
        .from("notes")
        .select(
          "id, title, description, reminder_start, reminder_end, reminder_identifier"
        )
        .eq("user_id", userId)
        .not("reminder_start", "is", null)
        .order("reminder_start", { ascending: true });
      if (error) throw error;
      setReminders((data as ReminderItem[]) ?? []);
    } catch {
      setReminders([]);
    } finally {
      setLoadingReminders(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders])
  );

  const handleDeleteReminder = async (item: ReminderItem) => {
    if (!userId) return;
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Eliminar recordatorio",
        "¿Querés eliminar este recordatorio?",
        [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
        ]
      );
    });
    if (!confirm) return;
    try {
      if (item.reminder_identifier) {
        try {
          await Notifications.cancelScheduledNotificationAsync(
            item.reminder_identifier
          );
        } catch {}
      }
      const { error } = await supabase
        .from("notes")
        .update({
          reminder_start: null,
          reminder_end: null,
          reminder_identifier: null,
        })
        .eq("id", item.id)
        .eq("user_id", userId);
      if (error) throw error;
      await fetchReminders();
    } catch {
      Alert.alert("Error", "No se pudo eliminar el recordatorio.");
    }
  };

  const handleClearAllReminders = async () => {
    if (!userId) return;
    if (reminders.length === 0) return;
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Borrar todo",
        "¿Querés eliminar todos los recordatorios?",
        [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          { text: "Borrar todo", style: "destructive", onPress: () => resolve(true) },
        ]
      );
    });
    if (!confirm) return;
    try {
      const identifiers = reminders
        .map((r) => r.reminder_identifier)
        .filter(Boolean) as string[];
      for (const id of identifiers) {
        try {
          await Notifications.cancelScheduledNotificationAsync(id);
        } catch {}
      }
      const { error } = await supabase
        .from("notes")
        .update({
          reminder_start: null,
          reminder_end: null,
          reminder_identifier: null,
        })
        .eq("user_id", userId)
        .not("reminder_start", "is", null);
      if (error) throw error;
      await fetchReminders();
    } catch {
      Alert.alert("Error", "No se pudieron borrar los recordatorios.");
    }
  };

  const sortedReminders = reminders.slice().sort((a, b) => {
    const sa = a.reminder_start ? new Date(a.reminder_start).getTime() : 0;
    const sb = b.reminder_start ? new Date(b.reminder_start).getTime() : 0;
    return sa - sb;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <WeatherCard />

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

          {userId && (
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 999,
                backgroundColor: colors.surface || "#ffffff",
                borderWidth: 1,
                borderColor: colors.primary || "#1e3a8a",
                position: "relative",
              }}
              onPress={() => setShowReminders((v) => !v)}
            >
              <MaterialIcons
                name={
                  pendingCount > 0 ? "notifications-active" : "notifications-none"
                }
                size={22}
                color={colors.primary || "#1e3a8a"}
              />
              {pendingCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor: "red",
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {userId && showReminders && (
          <View
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 12,
              backgroundColor: colors.surface || "#fff",
              borderWidth: 1,
              borderColor: colors.primary || "#1e3a8a",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.primary || "#1e3a8a",
                }}
              >
                Recordatorios
              </Text>

              {sortedReminders.length > 0 && !loadingReminders && (
                <TouchableOpacity
                  onPress={handleClearAllReminders}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: "#ffe4e4",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "red",
                    }}
                  >
                    Borrar todo
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {loadingReminders ? (
              <ActivityIndicator style={{ marginVertical: 8 }} />
            ) : sortedReminders.length === 0 ? (
              <Text style={{ opacity: 0.6 }}>No hay recordatorios.</Text>
            ) : (
              sortedReminders.map((r) => {
                const status = getStatus(r);
                const statusText =
                  status === "activo"
                    ? "Activo"
                    : status === "programado"
                    ? "Programado"
                    : "Expirado";
                const statusColor =
                  status === "activo"
                    ? colors.primary || "#1e3a8a"
                    : status === "programado"
                    ? colors.textSecondary
                    : "red";

                return (
                  <View
                    key={r.id}
                    style={{
                      paddingVertical: 8,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(DRAWER_ROUTES.NOTAS as never)
                        }
                        style={{ flex: 1, paddingRight: 8 }}
                      >
                        <Text style={{ fontWeight: "600" }} numberOfLines={1}>
                          {r.title || "Nota sin título"}
                        </Text>
                        <Text style={{ opacity: 0.7 }} numberOfLines={2}>
                          {formatRange(r.reminder_start, r.reminder_end)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            marginTop: 2,
                            color: statusColor,
                          }}
                        >
                          {statusText}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteReminder(r)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: "#ffdddd",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="close" size={18} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

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

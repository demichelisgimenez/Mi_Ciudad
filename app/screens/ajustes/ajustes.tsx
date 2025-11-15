import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import { ajustesStyles as styles, switchColors } from "@utils/styles/ajustes";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@shared/context/AuthContext";
import { supabase } from "@utils/supabase";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@app/navigation/types";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";
import { AUTH_ACTIONS } from "@shared/context/AuthContext/enums";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeChoice = "blue" | "dark" | "light";

export default function Ajustes() {
  const { state, dispatch } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [theme, setTheme] = useState<ThemeChoice>("blue");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("notifications_enabled")
      .then((v) => {
        if (v === "0") setNotifications(false);
        else if (v === "1") setNotifications(true);
      })
      .catch(() => {});
  }, []);

  const handleLogin = () => {
    navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
  };

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.getSession();
      const { error } = await supabase.auth.signOut({ scope: "global" as any });
      if (error && error.message !== "Auth session missing") throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      setSigningOut(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    try {
      await AsyncStorage.setItem("notifications_enabled", value ? "1" : "0");
    } catch {}

    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== "granted") {
          setNotifications(false);
          try {
            await AsyncStorage.setItem("notifications_enabled", "0");
          } catch {}
          Alert.alert(
            "Permisos requeridos",
            "No se pudieron habilitar las notificaciones. Revisá los permisos del sistema."
          );
        }
      }
    } else {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch {}
    }
  };

  const ThemeOption = ({ label, value }: { label: string; value: ThemeChoice }) => {
    const isSelected = theme === value;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setTheme(value)}
        style={styles.themeOption}
      >
        <View
          style={[
            styles.themeDot,
            value === "blue" && styles.themeDot_blue,
            value === "dark" && styles.themeDot_dark,
            value === "light" && styles.themeDot_light,
            isSelected && styles.themeDotSelected,
          ]}
        />
        <Text style={styles.themeOptionLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="cellular-outline" size={18} style={styles.iconNeutral} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Tema</Text>
            <Text style={styles.cardSubtitle}>Personaliza la apariencia</Text>
          </View>
        </View>

        <View style={styles.themeRow}>
          <ThemeOption label="Azul" value="blue" />
          <ThemeOption label="Oscuro" value="dark" />
          <ThemeOption label="Claro" value="light" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={18} style={styles.iconNeutral} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Notificaciones</Text>
            <Text style={styles.cardSubtitle}>Recibir alertas y actualizaciones</Text>
          </View>

          <View style={styles.flexSpacer} />
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            thumbColor={notifications ? switchColors.thumbOn : switchColors.thumbOff}
            trackColor={{ false: switchColors.trackOff, true: switchColors.trackOn }}
          />
        </View>
      </View>

      {state?.user ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleLogout}
          style={[styles.card, styles.logoutCard, signingOut && { opacity: 0.6 }]}
          disabled={signingOut}
        >
          <View style={styles.logoutRow}>
            <View style={[styles.iconCircle, styles.logoutIconCircle]}>
              <Ionicons name="log-out-outline" size={18} style={styles.iconLogout} />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.logoutTitle}>
                {signingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
              </Text>
              <Text style={styles.logoutSubtitle}>Salir de tu cuenta</Text>
            </View>

            <View style={styles.flexSpacer} />
            <Ionicons name="chevron-forward" size={18} style={styles.chevronLogout} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleLogin}
          style={[styles.card, styles.loginCard]}
        >
          <View style={styles.logoutRow}>
            <View style={[styles.iconCircle, styles.loginIconCircle]}>
              <Ionicons name="log-in-outline" size={18} style={styles.iconLogin} />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.loginTitle}>Iniciar Sesión</Text>
              <Text style={styles.loginSubtitle}>Accedé a tu cuenta</Text>
            </View>

            <View style={styles.flexSpacer} />
            <Ionicons name="chevron-forward" size={18} style={styles.chevronLogin} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

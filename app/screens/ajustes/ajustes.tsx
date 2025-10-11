import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import { ajustesStyles as styles, switchColors } from "@utils/styles/ajustes";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@shared/context/AuthContext";
import { supabase } from "@utils/supabase";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";

type ThemeChoice = "blue" | "dark" | "light";

export default function Ajustes() {
  const { state } = useAuth();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [theme, setTheme] = useState<ThemeChoice>("blue");
  const [notifications, setNotifications] = useState<boolean>(true);

const handleLogin = () => {
  navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN } as any);
};

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo cerrar sesión.");
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

      {/* Card: Tema */}
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

      {/* Card: Notificaciones */}
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
            onValueChange={setNotifications}
            thumbColor={notifications ? switchColors.thumbOn : switchColors.thumbOff}
            trackColor={{ false: switchColors.trackOff, true: switchColors.trackOn }}
          />
        </View>
      </View>

      {/* Card: Sesión */}
      {state?.user ? (
        <TouchableOpacity activeOpacity={0.9} onPress={handleLogout} style={[styles.card, styles.logoutCard]}>
          <View style={styles.logoutRow}>
            <View style={[styles.iconCircle, styles.logoutIconCircle]}>
              <Ionicons name="log-out-outline" size={18} style={styles.iconLogout} />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.logoutTitle}>Cerrar Sesión</Text>
              <Text style={styles.logoutSubtitle}>Salir de tu cuenta</Text>
            </View>

            <View style={styles.flexSpacer} />
            <Ionicons name="chevron-forward" size={18} style={styles.chevronLogout} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.9} onPress={handleLogin} style={[styles.card, styles.loginCard]}>
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

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, TextInput } from "react-native";
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
import Button from "@components/Button";
import { colors, sizes } from "@utils";
import { setNotificationsEnabled } from "@utils/notifications";

type ThemeChoice = "blue" | "dark" | "light";

export default function Ajustes() {
  const { state, dispatch } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [theme, setTheme] = useState<ThemeChoice>("blue");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [signingOut, setSigningOut] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("notifications_enabled")
      .then((v) => {
        if (v === "0") {
          setNotifications(false);
          setNotificationsEnabled(false);
        } else {
          setNotifications(true);
          setNotificationsEnabled(true);
        }
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
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem("notifications_enabled", value ? "1" : "0");
    } catch {}

    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== "granted") {
          setNotifications(false);
          setNotificationsEnabled(false);
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

  const handleChangePassword = async () => {
    if (!state?.user?.email) {
      Alert.alert("Error", "No se encontró el email del usuario.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Ups", "Completá todos los campos.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Atención", "La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Ups", "Las contraseñas nuevas no coinciden.");
      return;
    }
    if (updatingPassword) return;
    setUpdatingPassword(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: state.user.email,
        password: currentPassword,
      });
      if (signInError) {
        Alert.alert("Error", "La contraseña actual no es correcta.");
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      Alert.alert("Listo", "Tu contraseña fue actualizada.");
      setChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo cambiar la contraseña.");
    } finally {
      setUpdatingPassword(false);
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

      {state?.user && (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={18} style={styles.iconNeutral} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Seguridad</Text>
              <Text style={styles.cardSubtitle}>Gestionar tu contraseña</Text>
            </View>
          </View>

          {changingPassword ? (
            <View style={{ marginTop: sizes.base || 16 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#d0d0d0",
                  borderRadius: sizes.radius || 12,
                  paddingHorizontal: sizes.base || 12,
                  paddingVertical: 10,
                  marginBottom: 8,
                }}
                placeholder="Contraseña actual"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#d0d0d0",
                  borderRadius: sizes.radius || 12,
                  paddingHorizontal: sizes.base || 12,
                  paddingVertical: 10,
                  marginBottom: 8,
                }}
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#d0d0d0",
                  borderRadius: sizes.radius || 12,
                  paddingHorizontal: sizes.base || 12,
                  paddingVertical: 10,
                  marginBottom: 12,
                }}
                placeholder="Confirmar nueva contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Button
                    title={updatingPassword ? "Guardando..." : "Guardar"}
                    onPress={handleChangePassword}
                    loading={updatingPassword}
                    fullWidth
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (updatingPassword) return;
                    setChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    paddingVertical: 12,
                    borderRadius: sizes.radius || 12,
                    borderWidth: 1,
                    borderColor: "#d0d0d0",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  disabled={updatingPassword}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: colors.textSecondary || "#555",
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setChangingPassword(true)}
              style={{
                marginTop: sizes.base || 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.link || "#268fc0ff",
                }}
              >
                Cambiar contraseña
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                style={{
                  marginLeft: 6,
                  color: colors.link || "#268fc0ff",
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

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

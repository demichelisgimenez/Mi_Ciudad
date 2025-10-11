import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginStyles as styles } from "@utils/styles/login";

import { useNavigation, CommonActions, NavigationProp, ParamListBase } from "@react-navigation/native";
import { AUTH_ROUTES, ROOT_ROUTES, DRAWER_ROUTES } from "@utils/constants";

import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@utils/supabase";

export default function Login() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  function navigateToNotasAfterAuth() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: ROOT_ROUTES.SCREENS,
            params: { initialRouteName: DRAWER_ROUTES.NOTAS },
          },
        ],
      })
    );
  }

  const onLogin = async () => {
    try {
      if (!email || !pass) return Alert.alert("Ups", "Completá email y contraseña.");
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;

      Alert.alert("¡Bienvenido!", "Sesión iniciada.");
      navigateToNotasAfterAuth();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <View style={[styles.input, { flexDirection: "row", alignItems: "center" }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Contraseña"
          secureTextEntry={!showPass}
          value={pass}
          onChangeText={setPass}
          editable={!loading}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} disabled={loading} onPress={onLogin}>
        <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Ingresar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={goToRegister} disabled={loading}>
        <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} disabled>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

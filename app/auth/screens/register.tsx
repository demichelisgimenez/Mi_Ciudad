import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { registerStyles as styles } from "@utils/styles/register";

import { useNavigation, CommonActions, NavigationProp, ParamListBase } from "@react-navigation/native";
import { ROOT_ROUTES, DRAWER_ROUTES } from "@utils/constants";
import { supabase } from "@utils/supabase";

export default function Register() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
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

  const onRegister = async () => {
    try {
      if (!email || !pass) return Alert.alert("Ups", "Completá email y contraseña.");
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { nombre, apellido } },
      });
      if (error) throw error;

      if (data.session) {
        Alert.alert("¡Bienvenido!", "Cuenta creada y sesión iniciada.");
        navigateToNotasAfterAuth();
        return;
      }

      Alert.alert("¡Listo!", "Revisá tu email para confirmar la cuenta.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <TouchableOpacity style={styles.button} onPress={onRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Registrando..." : "Registrarse"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

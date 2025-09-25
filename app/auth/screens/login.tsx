import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginStyles as styles } from "@utils/styles/login";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../index"; 
import {AUTH_ROUTES } from "@utils/constants";
export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Inputs */}
      <TextInput style={styles.input} placeholder="Usuario o email" editable={true} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry editable={true} />

      {/* Botón ingresar */}
      <TouchableOpacity style={styles.button} disabled={false}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} disabled={true}>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

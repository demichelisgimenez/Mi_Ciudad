import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerStyles as styles } from "@utils/styles/register";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../index"; // 
export default function Register() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      {/* Inputs */}
      <TextInput style={styles.input} placeholder="Nombre" editable={false} />
      <TextInput style={styles.input} placeholder="Apellido" editable={false} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        editable={false}
      />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry editable={false} />

      {/* Botón registrarse */}
      <TouchableOpacity style={styles.button} disabled={true}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Botón volver al login */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

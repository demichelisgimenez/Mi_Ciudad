import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerStyles as styles } from "@utils/styles/register";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../index";
import { AUTH_ROUTES } from "@utils/constants";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombre" editable={true} />
      <TextInput style={styles.input} placeholder="Apellido" editable={true} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        editable={true}
      />

      <View style={[styles.input, { flexDirection: "row", alignItems: "center" }]}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Contraseña"
          secureTextEntry={!showPass}
          editable={true}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} disabled={false}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN as never)}
      >
        <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

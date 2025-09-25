import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginStyles as styles } from "@utils/styles/login";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../index";
import { AUTH_ROUTES } from "@utils/constants";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Usuario */}
      <TextInput
        style={styles.input}
        placeholder="Usuario o email"
        editable={true}
      />

      {/* Contraseña con toggle */}
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

      {/* Botón ingresar */}
      <TouchableOpacity style={styles.button} disabled={false}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER as never)}
      >
        <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} disabled={true}>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

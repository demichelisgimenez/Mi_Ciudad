import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerStyles as styles } from "@utils/styles/register";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@utils/supabase";
import Button from "@components/Button";
import { colors, sizes } from "@utils";

const TITLE_TOP = 16;
const LINKS_GAP = 10;

export default function Register() {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    try {
      if (!email || !pass) return Alert.alert("Ups", "Completá email y contraseña.");
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { nombre, apellido } },
      });
      if (error) throw error;
      Alert.alert("¡Listo!", "Revisá tu email para confirmar la cuenta.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: TITLE_TOP,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: 520, alignSelf: "center" }}>
            <Text style={[styles.title, { textAlign: "center", marginBottom: sizes.base || 16 }]}>
              Crear cuenta
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
            />
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

            <View style={{ marginTop: 8 }}>
              <Button
                title={loading ? "Registrando..." : "Registrarse"}
                onPress={onRegister}
                loading={loading}
                fullWidth
              />
            </View>

            <View style={{ marginTop: LINKS_GAP }}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

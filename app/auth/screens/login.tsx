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
import { loginStyles as styles } from "@utils/styles/login";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../index";
import { AUTH_ROUTES, DRAWER_ROUTES, ROOT_ROUTES } from "@utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@utils/supabase";
import Button from "@components/Button";
import { colors, sizes } from "@utils";

const TITLE_TOP = 16;
const LINKS_GAP = 10;

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      if (!email || !pass) return Alert.alert("Ups", "Completá email y contraseña.");
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: ROOT_ROUTES.SCREENS as never,
              params: { initialRouteName: DRAWER_ROUTES.NOTAS } as never,
            } as never,
          ],
        })
      );
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo iniciar sesión.");
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
              Iniciar Sesión
            </Text>

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
              <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={8}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.textSecondary || "#666"}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              <Button
                title={loading ? "Ingresando..." : "Ingresar"}
                onPress={onLogin}
                loading={loading}
                fullWidth
              />
            </View>

            <View style={{ marginTop: LINKS_GAP }}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER as never)}
                disabled={loading}
              >
                <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} disabled>
                <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

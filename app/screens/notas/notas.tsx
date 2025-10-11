import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@shared/context/AuthContext";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";

export default function Notas() {
  const { state } = useAuth();
  const navigation = useNavigation();

  // Si NO hay usuario autenticado, mostramos prompt para login/registro
  if (!state?.user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Notas</Text>

        {/* Botones para Iniciar Sesión / Registrarme */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate(
                ROOT_ROUTES.AUTH as never,
                { screen: AUTH_ROUTES.LOGIN } as never
              )
            }
          >
            <Ionicons name="log-in-outline" size={20} color="white" />
            <Text style={styles.addButtonText}> Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate(
                ROOT_ROUTES.AUTH as never,
                { screen: AUTH_ROUTES.REGISTER } as never
              )
            }
          >
            <Ionicons name="person-add-outline" size={20} color="white" />
            <Text style={styles.addButtonText}> Registrarme</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text>Ingresá para crear y ver tus notas.</Text>
        </View>
      </View>
    );
  }

  // Si HAY usuario autenticado, mostramos la UI de notas original
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Notas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una nota..."
          editable={true}
        />
        <TouchableOpacity style={styles.addButton} disabled={false}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.addButtonText}> Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton} disabled={false}>
          <Ionicons name="camera-outline" size={20} color="white" />
          <Text style={styles.addButtonText}> Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} disabled={false}>
          <Ionicons name="images-outline" size={20} color="white" />
          <Text style={styles.addButtonText}> Galería</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notesList}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Comprar pan</Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Ir a la Farmacia</Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Realizar evaluaciones</Text>
        </View>
      </ScrollView>
    </View>
  );
}

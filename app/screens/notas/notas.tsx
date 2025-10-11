import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@app/navigation/types";
import { useAuth } from "@shared/context/AuthContext";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";

export default function Notas() {
  const { state } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!state?.user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Notas</Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN })}
          >
            <Ionicons name="log-in-outline" size={20} color="white" />
            <Text style={styles.addButtonText}> Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.REGISTER })}
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Notas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una nota..."
          editable
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.addButtonText}> Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="camera-outline" size={20} color="white" />
          <Text style={styles.addButtonText}> Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
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

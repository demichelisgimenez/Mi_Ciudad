import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";
import { Ionicons } from "@expo/vector-icons";

export default function Notas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Notas</Text>

      {/* Input de nueva nota */}
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

      {/* Botones de cámara y galería */}
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

      {/* Lista de notas */}
      <ScrollView style={styles.notesList}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Comprar pan en la panadería del centro
          </Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Llamar a la farmacia de turno</Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Revisar horario de la escuela N°5
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

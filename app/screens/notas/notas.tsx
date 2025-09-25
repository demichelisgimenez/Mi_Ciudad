import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";

export default function Notas() {
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
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton} disabled={false}>
          <Text style={styles.addButtonText}>📷Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} disabled={false}>
          <Text style={styles.addButtonText}>🖼️ Galería</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notesList}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Comprar pan en la panadería del centro</Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Llamar a la farmacia de turno</Text>
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Revisar horario de la escuela N°5</Text>
        </View>
      </ScrollView>
    </View>
  );
}

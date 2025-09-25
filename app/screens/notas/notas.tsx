import React from "react";
import {View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";
import { Ionicons } from "@expo/vector-icons";

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

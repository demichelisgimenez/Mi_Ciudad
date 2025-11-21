import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sobreMiCiudadStyles as styles } from "@utils/styles/sobreMiCiudad";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Cambiá por tu link real

export default function SobreMiCiudadScreen() {
  const openVideo = () => {
    Linking.openURL(YOUTUBE_URL);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BLOQUE 1: Título + descripción */}
        <View style={styles.block}>
          <Text style={styles.mainTitle}>Mi Ciudad</Text>
          <Text style={styles.subtitle}>Federal, Entre Ríos</Text>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
            ¿Qué es Mi Ciudad?
          </Text>
          <Text style={styles.sectionText}>
            Mi Ciudad es una aplicación móvil pensada para los habitantes de Federal, Entre Ríos.
            Reúne en un mismo lugar información local como farmacias, escuelas, teléfonos útiles y
            radios de la ciudad. Además, ofrece herramientas personales como notas con
            recordatorios y un lector de códigos QR.
          </Text>
        </View>

        {/* BLOQUE 2: Funcionalidades */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Funcionalidades principales</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💊</Text>
              <Text style={styles.featureText}>Farmacias con datos de contacto</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🏫</Text>
              <Text style={styles.featureText}>Listado de escuelas de Federal</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📞</Text>
              <Text style={styles.featureText}>Teléfonos útiles de servicios y emergencias</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📻</Text>
              <Text style={styles.featureText}>Radios locales en vivo</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureText}>Notas personales con recordatorios</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Lector de códigos QR integrado</Text>
            </View>
          </View>
        </View>

        {/* BLOQUE 3: Académico */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Desarrollo académico</Text>
          <Text style={styles.sectionText}>
            Esta aplicación fue desarrollada como proyecto para la materia Desarrollo de
            Aplicaciones Móviles, correspondiente a la Tecnicatura Universitaria en Desarrollo
            Web de la Universidad Nacional de Entre Ríos (UNER).
          </Text>

          <View style={styles.academicBox}>
            <Text style={styles.academicLabel}>Institución</Text>
            <Text style={styles.academicValue}>
              UNER · FCAD · Tecnicatura Universitaria en Desarrollo Web
            </Text>

            <Text style={styles.academicLabel}>Materia</Text>
            <Text style={styles.academicValue}>Desarrollo de Aplicaciones Móviles</Text>

            <Text style={styles.academicLabel}>Desarrollado por</Text>
            <Text style={styles.academicValue}>
              Agustín Demichelis y Enzo Daniel Gimenez Silva
            </Text>
          </View>
        </View>

        {/* BLOQUE 4: Video */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Conocé Mi Ciudad en acción</Text>
          <Text style={styles.sectionText}>
            Mirá el video promocional para ver cómo funciona la aplicación y sus principales
            secciones.
          </Text>

          <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
            <Text style={styles.videoButtonIcon}>▶</Text>
            <Text style={styles.videoButtonText}>Ver video en YouTube</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hecho con orgullo para Federal, Entre Ríos 🇦🇷</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

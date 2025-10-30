import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions, scanFromURLAsync } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { qrStyles as styles } from "@utils/styles/qr";
import {supabase} from "@utils/supabase";
import { useAuth } from "@shared/context/AuthContext";

type Mode = "camera" | "idle";

export default function QRScreen() {
  const { state } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();

  const [mode, setMode] = useState<Mode>("camera");
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [title, setTitle] = useState("");

  const scanAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, styles.overlay.frameSize - 8],
  });

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permTitle}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Ionicons name="camera" size={18} />
          <Text style={styles.primaryBtnText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const resolveUserId = async (): Promise<string | null> => {
    try {
      const s: any = state;
      const fromState =
        s?.user?.id ||
        s?.user?.user?.id ||
        s?.session?.user?.id;
      if (fromState) return String(fromState);

      return null;
    } catch {
      return null;
    }
  };

  const handleBarcodeScanned = (data: string) => {
    setScanned(true);
    setLink(data);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos para leer un QR desde imagen.");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (res.canceled || !res.assets?.length) return;

      setMode("idle");
      setScanned(false);
      setLink(null);

      const uri = res.assets[0].uri;
      const results = await scanFromURLAsync(uri, ["qr"]);

      if (!results.length) {
        Alert.alert("Sin QR", "No se detectó un QR válido en la imagen.");
        return;
      }

      const value = (results[0] as any)?.data ?? (results[0] as any)?.content?.data ?? null;
      if (value) {
        setScanned(true);
        setLink(String(value));
      } else {
        Alert.alert("Sin QR", "No se detectó un QR válido en la imagen.");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo procesar la imagen.");
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setLink(null);
    setTitle("");
    setMode("camera");
  };

  const handleOpen = () => {
    if (link) Linking.openURL(link).catch(() => Alert.alert("Error", "No se pudo abrir el enlace."));
  };

  const handleSaveAskTitle = () => {
    try {
      if (link) {
        const u = new URL(link);
        setTitle((prev) => prev || `QR de ${u.hostname}`);
      }
    } catch {
      setTitle((prev) => prev || "QR escaneado");
    }
    setShowTitleModal(true);
  };

  const handleSave = async () => {
    if (!link) return;
    setSaving(true);
    try {
      const userId = await resolveUserId();
      if (!userId) {
        Alert.alert("Iniciá sesión", "Tenés que iniciar sesión para guardar en Notas.");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("notes").insert({
        user_id: userId,
        title: title?.trim() || null,
        description: link,
      });
      if (error) throw error;

      setShowTitleModal(false);
      Alert.alert("Listo", "Link guardado en Notas ✅");
    } catch (e: any) {
      Alert.alert("No se pudo guardar", e?.message ?? "Intentalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lector QR</Text>
        <Text style={styles.headerSubtitle}>Usá la cámara o cargá una imagen de tu galería</Text>
      </View>

      <View style={styles.cameraWrap}>
        {mode === "camera" && (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={({ data }) => (!scanned ? handleBarcodeScanned(String(data)) : undefined)}
            />
            <View style={styles.overlay.root} pointerEvents="none">
              <View style={styles.overlay.frame}>
                {/* esquinas */}
                <View style={[styles.overlay.corner, styles.overlay.tl]} />
                <View style={[styles.overlay.corner, styles.overlay.tr]} />
                <View style={[styles.overlay.corner, styles.overlay.bl]} />
                <View style={[styles.overlay.corner, styles.overlay.br]} />
                {/* línea */}
                {!scanned && (
                  <Animated.View
                    style={[styles.overlay.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>

      <View style={[styles.resultCard, scanned ? styles.resultVisible : null]}>
        {!scanned ? (
          <Text style={styles.statusText}>
            {mode === "camera" ? "Apuntá al código…" : "Elegí una imagen para analizar."}
          </Text>
        ) : (
          <>
            <Text style={styles.resultLabel}>Resultado del escaneo</Text>
            <Text selectable numberOfLines={3} style={styles.resultText}>
              {link}
            </Text>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => {
              setMode("camera");
              setScanned(false);
              setLink(null);
            }}
          >
            <Ionicons name="camera-outline" size={18} />
            <Text style={styles.secondaryBtnText}>Usar cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={18} />
            <Text style={styles.secondaryBtnText}>Cargar imagen</Text>
          </TouchableOpacity>
        </View>

        {scanned && (
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleOpen}>
              <Ionicons name="open-outline" size={18} />
              <Text style={styles.primaryBtnText}>Abrir link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleSaveAskTitle}>
              <Ionicons name="save-outline" size={18} />
              <Text style={styles.secondaryBtnText}>Guardar en Notas</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.ghostBtn} onPress={handleRescan}>
          <Ionicons name="scan-outline" size={18} />
          <Text style={styles.ghostBtnText}>{scanned ? "Escanear nuevamente" : "Reiniciar"}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showTitleModal} transparent animationType="slide" onRequestClose={() => setShowTitleModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Guardar en Notas</Text>
            <Text style={styles.modalHint}>Título (opcional)</Text>
            <TextInput
              style={styles.modalInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: QR del menú, QR de inscripción…"
              placeholderTextColor="#98A2B3"
              maxLength={120}
            />
            <Text numberOfLines={2} style={styles.modalLinkPreview}>
              {link}
            </Text>

            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowTitleModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Ionicons name="checkmark-circle-outline" size={18} />
                <Text style={styles.modalSaveText}>{saving ? "Guardando…" : "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

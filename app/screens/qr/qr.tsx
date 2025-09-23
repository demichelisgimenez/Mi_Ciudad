import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitamos permiso para usar la cámara</Text>
        <Button onPress={requestPermission} title="Dar permiso" />
      </View>
    );
  }

  const handleBarcodeScanned = (data: string) => {
    setScanned(true);
    setLink(data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => !scanned && handleBarcodeScanned(data)}
      />

      {scanned && (
        <View style={styles.actions}>
          <Text style={styles.text}>🔗 Link detectado:</Text>
          <Text style={styles.link}>{link}</Text>

          <Button title="Abrir link" onPress={() => link && Linking.openURL(link)} />
          <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  link: {
    color: "#4fc3f7",
    marginBottom: 10,
  },
});

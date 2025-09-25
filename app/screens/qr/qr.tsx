import React, { useState } from "react";
import { Text, View, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { qrStyles as styles } from "@utils/styles/qr";
import { Linking } from "react-native";

export default function QR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  if (!permission) return <View />;

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
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => !scanned && handleBarcodeScanned(data)}
      />

      {scanned && (
        <View style={styles.actions}>
          <Text style={styles.text}>Link detectado:</Text>
          <Text style={styles.link}>{link}</Text>

          <Button title="Abrir link" onPress={() => link && Linking.openURL(link)} />
          <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

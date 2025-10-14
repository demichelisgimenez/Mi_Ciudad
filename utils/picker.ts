import * as ImagePicker from "expo-image-picker";

async function ensurePermission(kind: "camera" | "library") {
  const ask =
    kind === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (ask.status !== "granted") {
    throw new Error(kind === "camera" ? "Necesitamos acceso a la cámara." : "Necesitamos acceso a tu galería.");
  }
}

export async function pickImage(kind: "camera" | "library"): Promise<string | null> {
  await ensurePermission(kind);
  const launcher = kind === "camera" ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
  const result = await launcher({
    allowsEditing: false,
    quality: 0.85,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });
  return result.canceled ? null : result.assets[0].uri;
}

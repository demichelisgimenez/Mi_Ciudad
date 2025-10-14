import React from "react";
import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { notasStyles as styles } from "@utils/styles/notas";
import Button from "@components/Button";
import { sizes } from "@utils";
import { useImageRatio } from "@utils/use-image-ratio";

type Props = {
  title: string;
  setTitle: (s: string) => void;
  desc: string;
  setDesc: (s: string) => void;
  imageUri: string | null;
  setImageUri: (s: string | null) => void;
  loading: boolean;
  onAdd: () => void;
  onPickCamera: () => void | Promise<void>;
  onPickLibrary: () => void | Promise<void>;
};

export default function Composer({
  title, setTitle, desc, setDesc,
  imageUri, setImageUri,
  loading, onAdd, onPickCamera, onPickLibrary,
}: Props) {

  const ratio = useImageRatio(imageUri || undefined);

  return (
    <View style={styles.composerCard}>
      <TextInput
        style={styles.titleInput}
        placeholder="Título (opcional)"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.composerRow}>
        <TextInput
          style={styles.input}
          placeholder={imageUri ? "Agregá una descripción para la imagen..." : "Descripción / contenido..."}
          value={desc}
          onChangeText={setDesc}
          multiline
        />

        <Button
          title={loading ? "Agregando..." : "Agregar"}
          icon="add-circle-outline"
          onPress={onAdd}
          disabled={loading}
          style={{ marginLeft: sizes?.sm ?? 10 }}
        />
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.previewImage, { aspectRatio: ratio }]}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setImageUri(null)} style={styles.previewRemove}>
            <Ionicons name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.composerActions}>
        <Button title="Cámara" icon="camera-outline" onPress={onPickCamera} style={{ marginRight: sizes?.sm ?? 8 }} />
        <Button title="Galería" icon="images-outline" onPress={onPickLibrary} variant="outline" />
      </View>
    </View>
  );
}

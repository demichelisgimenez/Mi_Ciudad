import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { notasStyles as styles } from "@utils/styles/notas";
import type { EditState, Note, ReminderMenuContext } from "../types";
import { useImageRatio } from "@utils/use-image-ratio";

type Props = {
  note: Note;
  editing: EditState;
  startEdit: (n: Note) => void;
  cancelEdit: () => void;
  saveEdit: (n: Note) => void;
  setEditing: (e: EditState) => void;
  deleteNote: (n: Note) => void;
  onOpenReminderMenu: (n: Note) => void;
  onClearReminder: (n: Note) => void;
  notificationsEnabled: boolean;
  onReminderOptionsRequested: (n: Note, ctx: ReminderMenuContext) => void;
};

function formatReminderRange(note: Note) {
  if (!note.reminder_start || !note.reminder_end) return null;
  const start = new Date(note.reminder_start);
  const end = new Date(note.reminder_end);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const day = start.toLocaleDateString();
  const h1 = start.toTimeString().slice(0, 5);
  const h2 = end.toTimeString().slice(0, 5);
  return `${day} · ${h1} a ${h2} hs`;
}

export default function Card({
  note,
  editing,
  startEdit,
  cancelEdit,
  saveEdit,
  setEditing,
  deleteNote,
  onOpenReminderMenu,
  onClearReminder,
  notificationsEnabled,
  onReminderOptionsRequested,
}: Props) {
  const isEditing = editing?.id === note.id;
  const updatedDifferent =
    new Date(note.updated_at).getTime() !==
    new Date(note.created_at).getTime();
  const showRevertBtn = isEditing && editing?.imageUri !== undefined;

  const imageToShow = isEditing
    ? editing!.imageUri === null
      ? null
      : typeof editing!.imageUri === "string"
      ? editing!.imageUri
      : note.image_url
    : note.image_url || null;

  const ratio = useImageRatio(imageToShow || undefined);
  const reminderText = formatReminderRange(note);
  const hasReminder = !!reminderText;

  const handleReminderMenu = () => {
    if (!notificationsEnabled) {
      onReminderOptionsRequested(note, "notificationsOff");
      return;
    }
    if (!hasReminder) {
      onReminderOptionsRequested(note, "noReminder");
      return;
    }
    onReminderOptionsRequested(note, "hasReminder");
  };

  return (
    <View style={[styles.noteCard, isEditing && styles.noteCardEditing]}>
      <View style={styles.noteHeaderRow}>
        {isEditing ? (
          <TextInput
            style={[styles.editTitleInput, { flex: 1, marginRight: 8 }]}
            placeholder="Título (opcional)"
            value={editing!.title}
            onChangeText={(t) => setEditing({ ...editing!, title: t })}
          />
        ) : note.title ? (
          <Text style={[styles.noteTitle, { flex: 1 }]} numberOfLines={2}>
            {note.title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <TouchableOpacity
          onPress={handleReminderMenu}
          style={styles.noteMenuButton}
        >
          <Ionicons
            name="alarm-outline"
            size={18}
            color={hasReminder ? "#e11d48" : undefined}
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          placeholder="Descripción..."
          value={editing!.description}
          onChangeText={(t) => setEditing({ ...editing!, description: t })}
          multiline
        />
      ) : note.description ? (
        <Text style={styles.noteText}>{note.description}</Text>
      ) : null}

      {isEditing ? (
        editing!.imageUri === null ? (
          <View style={styles.noteImagePlaceholder}>
            <Text style={styles.placeholderText}>
              Imagen quitada (guardá para aplicar)
            </Text>
          </View>
        ) : imageToShow ? (
          <Image
            source={{ uri: imageToShow }}
            style={[styles.noteImage, { aspectRatio: ratio }]}
            resizeMode="contain"
          />
        ) : null
      ) : imageToShow ? (
        <Image
          source={{ uri: imageToShow }}
          style={[styles.noteImage, { aspectRatio: ratio }]}
          resizeMode="contain"
        />
      ) : null}

      <Text style={styles.noteDate}>
        Creado: {new Date(note.created_at).toLocaleString()}
        {updatedDifferent
          ? ` · Actualizado: ${new Date(
              note.updated_at
            ).toLocaleString()}`
          : ""}
      </Text>

      {reminderText && (
        <Text style={styles.noteReminder}>{reminderText}</Text>
      )}

      {isEditing && (
        <View style={styles.cardActions}>
          {showRevertBtn && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                setEditing({ ...editing!, imageUri: undefined })
              }
            >
              <Ionicons name="refresh-outline" size={18} />
              <Text style={styles.actionText}>Deshacer cambio de imagen</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setEditing({
                ...editing!,
                imageUri: "PICK_CAMERA" as any,
              })
            }
          >
            <Ionicons name="camera-outline" size={18} />
            <Text style={styles.actionText}>Cambiar (Cámara)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setEditing({
                ...editing!,
                imageUri: "PICK_LIBRARY" as any,
              })
            }
          >
            <Ionicons name="images-outline" size={18} />
            <Text style={styles.actionText}>Cambiar (Galería)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setEditing({ ...editing!, imageUri: null })}
          >
            <Ionicons name="trash-outline" size={18} />
            <Text style={styles.actionText}>Quitar imagen</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.cardActions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => saveEdit(note)}
              disabled={!!editing?.saving}
            >
              <Ionicons name="save-outline" size={18} />
              <Text style={styles.actionText}>
                {editing?.saving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={cancelEdit}
              disabled={!!editing?.saving}
            >
              <Ionicons name="close-outline" size={18} />
              <Text style={styles.actionText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => startEdit(note)}
            >
              <Ionicons name="pencil-outline" size={18} />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteNote(note)}
            >
              <Ionicons name="trash-outline" size={18} />
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

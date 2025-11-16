import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { notasStyles as styles } from "@utils/styles/notas";
import { Note, ReminderMenuContext } from "../types";

type Props = {
  visible: boolean;
  note: Note | null;
  context: ReminderMenuContext | null;
  onClose: () => void;
  onGoToSettings: () => void;
  onOpenPicker: (note: Note) => void;
  onClearReminder: (note: Note) => void;
};

export default function ReminderMenu({
  visible,
  note,
  context,
  onClose,
  onGoToSettings,
  onOpenPicker,
  onClearReminder,
}: Props) {
  if (!visible || !note || !context) return null;

  let menuEmoji = "";
  let iconCircleExtraStyle = styles.reminderMenuIconCircleReminder;
  let menuTitle = "";
  let menuText = "";
  let primaryLabel = "";
  let secondaryLabel = "";
  let showSteps = false;
  let showDelete = false;

  if (context === "notificationsOff") {
    menuEmoji = "🔔";
    iconCircleExtraStyle = styles.reminderMenuIconCircleNotification;
    menuTitle = "Activar notificaciones";
    menuText =
      "Para agregar recordatorios necesitás activar las notificaciones en Ajustes.";
    primaryLabel = "Ir a Ajustes";
    secondaryLabel = "Cerrar";
  } else if (context === "noReminder") {
    menuEmoji = "⏰";
    iconCircleExtraStyle = styles.reminderMenuIconCircleReminder;
    menuTitle = "Agregar recordatorio";
    menuText =
      "Vas a elegir una fecha y un rango horario para esta nota. Te avisamos al inicio.";
    primaryLabel = "Elegir fecha y hora";
    secondaryLabel = "Cancelar";
    showSteps = true;
  } else if (context === "hasReminder") {
    menuEmoji = "✏️";
    iconCircleExtraStyle = styles.reminderMenuIconCircleEdit;
    menuTitle = "Recordatorio de esta nota";
    menuText =
      "Podés cambiar el rango horario o quitar el recordatorio si ya no lo necesitás.";
    primaryLabel = "Editar";
    secondaryLabel = "Cancelar";
    showDelete = true;
  }

  const handlePrimary = () => {
    if (context === "notificationsOff") {
      onClose();
      onGoToSettings();
      return;
    }
    if (context === "noReminder" || context === "hasReminder") {
      const target = note;
      onClose();
      if (target) onOpenPicker(target);
    }
  };

  const handleSecondary = () => {
    onClose();
  };

  const handleDelete = () => {
    const target = note;
    onClose();
    if (target) onClearReminder(target);
  };

  return (
    <View style={styles.reminderMenuOverlay}>
      <View style={styles.reminderMenuCard}>
        <View style={[styles.reminderMenuIconCircle, iconCircleExtraStyle]}>
          <Text style={styles.reminderMenuIconEmoji}>{menuEmoji}</Text>
        </View>

        <Text style={styles.reminderMenuTitle}>{menuTitle}</Text>
        <Text style={styles.reminderMenuText}>{menuText}</Text>

        {showSteps && (
          <View style={styles.reminderStepsContainer}>
            <View className="step-1" style={styles.reminderStep}>
              <View style={styles.reminderStepCircle}>
                <Text style={styles.reminderStepNumber}>1</Text>
              </View>
              <View style={styles.reminderStepContent}>
                <Text style={styles.reminderStepTitle}>Seleccioná la fecha</Text>
                <Text style={styles.reminderStepDescription}>
                  Tocá el calendario y elegí el día del recordatorio.
                </Text>
              </View>
            </View>

            <View className="step-2" style={styles.reminderStep}>
              <View style={styles.reminderStepCircle}>
                <Text style={styles.reminderStepNumber}>2</Text>
              </View>
              <View style={styles.reminderStepContent}>
                <Text style={styles.reminderStepTitle}>Hora de inicio</Text>
                <Text style={styles.reminderStepDescription}>
                  Usá el reloj para definir cuándo empieza el recordatorio.
                </Text>
              </View>
            </View>

            <View className="step-3" style={styles.reminderStep}>
              <View style={styles.reminderStepCircle}>
                <Text style={styles.reminderStepNumber}>3</Text>
              </View>
              <View style={styles.reminderStepContent}>
                <Text style={styles.reminderStepTitle}>Hora de fin</Text>
                <Text style={styles.reminderStepDescription}>
                  Elegí hasta qué hora dura el recordatorio.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.reminderMenuButtonsRow}>
          <TouchableOpacity
            style={[styles.reminderMenuBtn, styles.reminderMenuBtnPrimary]}
            onPress={handlePrimary}
          >
            <Text
              style={[
                styles.reminderMenuBtnText,
                styles.reminderMenuBtnTextPrimary,
              ]}
            >
              {primaryLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reminderMenuBtn, styles.reminderMenuBtnSecondary]}
            onPress={handleSecondary}
          >
            <Text
              style={[
                styles.reminderMenuBtnText,
                styles.reminderMenuBtnTextSecondary,
              ]}
            >
              {secondaryLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {showDelete && (
          <View style={styles.reminderMenuButtonsRowSecondary}>
            <TouchableOpacity
              style={[styles.reminderMenuBtn, styles.reminderMenuBtnDanger]}
              onPress={handleDelete}
            >
              <Text
                style={[
                  styles.reminderMenuBtnText,
                  styles.reminderMenuBtnTextDanger,
                ]}
              >
                Borrar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

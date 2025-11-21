import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let notificationsEnabled = true;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function setNotificationsEnabled(value: boolean) {
  notificationsEnabled = value;
}

export function getNotificationsEnabled() {
  return notificationsEnabled;
}

export async function requestNotificationPermissions() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "General",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.status === "granted") return true;

  const req = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  return req.status === "granted";
}

type ScheduleNoteReminderParams = {
  noteId: string;
  title: string | null;
  description: string | null;
  date: Date;
};

export async function scheduleNoteReminder(params: ScheduleNoteReminderParams) {
  if (!notificationsEnabled) {
    throw new Error("Las notificaciones están desactivadas en Ajustes.");
  }

  const hasPerm = await requestNotificationPermissions();
  if (!hasPerm) {
    throw new Error("No se pudieron obtener permisos de notificaciones.");
  }

  if (params.date.getTime() <= Date.now()) {
    throw new Error("La fecha del recordatorio ya pasó. Elegí un horario futuro.");
  }

  const title =
    params.title && params.title.trim().length > 0 ? params.title : "Recordatorio de nota";

  const body =
    params.description && params.description.trim().length > 0
      ? params.description.slice(0, 120)
      : "Tocá para ver la nota.";

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: "NOTE_REMINDER", noteId: params.noteId },
    },
    // Forzamos el tipo para evitar el error de TS, pero Expo
    // admite perfectamente un Date como trigger.
    trigger: params.date as any,
  });

  return id;
}

export async function cancelNoteReminder(notificationId: string | null | undefined) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}

export async function cancelAllNoteReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

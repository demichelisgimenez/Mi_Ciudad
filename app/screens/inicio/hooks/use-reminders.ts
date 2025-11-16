import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { supabase } from "@utils/supabase";
import { ReminderItem } from "../types";

export function formatRange(start: string | null, end: string | null) {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return "";
  const day = s.toLocaleDateString();
  const h1 = s.toTimeString().slice(0, 5);
  const h2 = e.toTimeString().slice(0, 5);
  return `${day} · ${h1} a ${h2} hs`;
}

export function getStatus(r: ReminderItem) {
  if (!r.reminder_start || !r.reminder_end) return "programado" as const;
  const now = Date.now();
  const s = new Date(r.reminder_start).getTime();
  const e = new Date(r.reminder_end).getTime();
  if (now < s) return "programado" as const;
  if (now >= s && now <= e) return "activo" as const;
  return "expirado" as const;
}

export function useReminders(userId: string | null) {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);

  const fetchReminders = useCallback(async () => {
    if (!userId) {
      setReminders([]);
      return;
    }
    try {
      setLoadingReminders(true);
      const { data, error } = await supabase
        .from("notes")
        .select(
          "id, title, description, reminder_start, reminder_end, reminder_identifier"
        )
        .eq("user_id", userId)
        .not("reminder_start", "is", null)
        .order("reminder_start", { ascending: true });
      if (error) throw error;
      setReminders((data as ReminderItem[]) ?? []);
    } catch {
      setReminders([]);
    } finally {
      setLoadingReminders(false);
    }
  }, [userId]);

  const deleteReminder = useCallback(
    async (item: ReminderItem) => {
      if (!userId) return;
      const confirm = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Eliminar recordatorio",
          "¿Querés eliminar este recordatorio?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ]
        );
      });
      if (!confirm) return;
      try {
        if (item.reminder_identifier) {
          try {
            await Notifications.cancelScheduledNotificationAsync(
              item.reminder_identifier
            );
          } catch {}
        }
        const { error } = await supabase
          .from("notes")
          .update({
            reminder_start: null,
            reminder_end: null,
            reminder_identifier: null,
          })
          .eq("id", item.id)
          .eq("user_id", userId);
        if (error) throw error;
        await fetchReminders();
      } catch {
        Alert.alert("Error", "No se pudo eliminar el recordatorio.");
      }
    },
    [userId, fetchReminders]
  );

  const clearAllReminders = useCallback(async () => {
    if (!userId) return;
    if (reminders.length === 0) return;
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Borrar todo",
        "¿Querés eliminar todos los recordatorios?",
        [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Borrar todo",
            style: "destructive",
            onPress: () => resolve(true),
          },
        ]
      );
    });
    if (!confirm) return;
    try {
      const identifiers = reminders
        .map((r) => r.reminder_identifier)
        .filter(Boolean) as string[];
      for (const id of identifiers) {
        try {
          await Notifications.cancelScheduledNotificationAsync(id);
        } catch {}
      }
      const { error } = await supabase
        .from("notes")
        .update({
          reminder_start: null,
          reminder_end: null,
          reminder_identifier: null,
        })
        .eq("user_id", userId)
        .not("reminder_start", "is", null);
      if (error) throw error;
      await fetchReminders();
    } catch {
      Alert.alert("Error", "No se pudieron borrar los recordatorios.");
    }
  }, [userId, reminders, fetchReminders]);

  const sortedReminders = reminders
    .slice()
    .sort((a, b) => {
      const sa = a.reminder_start ? new Date(a.reminder_start).getTime() : 0;
      const sb = b.reminder_start ? new Date(b.reminder_start).getTime() : 0;
      return sa - sb;
    });

  const pendingCount = reminders.filter(
    (r) => getStatus(r) === "activo"
  ).length;

  return {
    reminders,
    loadingReminders,
    fetchReminders,
    deleteReminder,
    clearAllReminders,
    sortedReminders,
    pendingCount,
  };
}

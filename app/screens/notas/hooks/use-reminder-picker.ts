import { useState } from "react";
import { Platform } from "react-native";
import { Note } from "../types";

export type ReminderPickerStep = "date" | "startTime" | "endTime" | null;

type Params = {
  onConfirm: (note: Note, start: Date, end: Date) => Promise<void> | void;
};

export function useReminderPicker({ onConfirm }: Params) {
  const [reminderNote, setReminderNote] = useState<Note | null>(null);
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [pickerStep, setPickerStep] = useState<ReminderPickerStep>(null);

  const openForNote = (note: Note) => {
    const initial = note.reminder_start
      ? new Date(note.reminder_start)
      : new Date(Date.now() + 10 * 60 * 1000);
    setReminderNote(note);
    setBaseDate(initial);
    setStartDate(null);
    setPickerStep("date");
  };

  const closePicker = () => {
    setPickerStep(null);
    setStartDate(null);
    setReminderNote(null);
  };

  const handleDateTimeChange = (event: any, selected?: Date) => {
    if (!pickerStep) return;

    if (Platform.OS === "android" && event?.type === "dismissed") {
      closePicker();
      return;
    }

    if (!selected) return;

    if (pickerStep === "date") {
      const merged = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        baseDate.getHours(),
        baseDate.getMinutes()
      );
      setBaseDate(merged);
      setPickerStep("startTime");
      return;
    }

    if (pickerStep === "startTime") {
      const start = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        selected.getHours(),
        selected.getMinutes()
      );
      setStartDate(start);
      setPickerStep("endTime");
      return;
    }

    if (pickerStep === "endTime") {
      if (!reminderNote) {
        closePicker();
        return;
      }

      const finalStart = startDate || baseDate;

      let end = new Date(
        finalStart.getFullYear(),
        finalStart.getMonth(),
        finalStart.getDate(),
        selected.getHours(),
        selected.getMinutes()
      );

      if (end.getTime() <= finalStart.getTime()) {
        end = new Date(finalStart.getTime() + 30 * 60 * 1000);
      }

      const target = reminderNote;
      closePicker();
      onConfirm(target, finalStart, end);
    }
  };

  return {
    reminderNote,
    baseDate,
    pickerStep,
    openForNote,
    handleDateTimeChange,
  };
}

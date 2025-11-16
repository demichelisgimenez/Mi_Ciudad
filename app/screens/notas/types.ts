export type Note = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  reminder_start?: string | null;
  reminder_end?: string | null;
  reminder_identifier?: string | null;
};

export type EditState =
  | null
  | {
      id: string;
      title: string;
      description: string;
      imageUri?: string | null;
      saving?: boolean;
    };

export type ReminderMenuContext = "notificationsOff" | "noReminder" | "hasReminder";

export type Note = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
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

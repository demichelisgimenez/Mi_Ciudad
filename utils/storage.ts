import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "@utils/supabase";

const BUCKET = "notes";

export const extractStoragePathFromPublicUrl = (publicUrl: string): string | null => {
  const marker = "/object/public/";
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  const after = publicUrl.substring(i + marker.length);
  const prefix = `${BUCKET}/`;
  return after.startsWith(prefix) ? after.slice(prefix.length) : null;
};

const readAsArrayBuffer = async (uri: string) =>
  decode(await FileSystem.readAsStringAsync(uri, { encoding: "base64" as any }));

export async function uploadImageToStorage(localUri: string, userId: string): Promise<string> {
  const arrayBuffer = await readAsArrayBuffer(localUri);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, arrayBuffer, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

export async function removeStorageByPublicUrl(publicUrl: string | null) {
  if (!publicUrl) return;
  const relPath = extractStoragePathFromPublicUrl(publicUrl);
  if (!relPath) return;
  const { error } = await supabase.storage.from(BUCKET).remove([relPath]);
  if (error) console.log("Storage remove warning:", error.message);
}

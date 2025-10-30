import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@utils/supabase";
import { Note, EditState } from "../types";
import { uploadImageToStorage, removeStorageByPublicUrl } from "@utils/storage";

export function useNotes(userId: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState>(null);

  const clearNotes = useCallback(() => {
    setNotes([]);
    setLoadingList(false);
    setRefreshing(false);
    setEditing(null);
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, description, image_url, created_at, updated_at, user_id")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setNotes((data as Note[]) ?? []);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudieron cargar las notas.");
    } finally {
      setLoadingList(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      clearNotes();
      return;
    }
    fetchNotes();
  }, [userId, fetchNotes, clearNotes]);

  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  }, [userId, fetchNotes]);

  async function addNote() {
    if (!userId) return Alert.alert("Sesión requerida", "Iniciá sesión para crear notas.");
    if (!newTitle.trim() && !newDesc.trim() && !newImageUri) {
      return Alert.alert("Nada para guardar", "Escribí un título/descripcion o adjuntá una imagen.");
    }
    try {
      setLoadingCreate(true);
      const image_url = newImageUri ? await uploadImageToStorage(newImageUri, userId) : null;
      const { error } = await supabase.from("notes").insert({
        user_id: userId,
        title: newTitle.trim() || null,
        description: newDesc.trim() || null,
        image_url,
      });
      if (error) throw error;
      setNewTitle("");
      setNewDesc("");
      setNewImageUri(null);
      await fetchNotes();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo guardar la nota.");
    } finally {
      setLoadingCreate(false);
    }
  }

  async function deleteNote(n: Note) {
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert("Eliminar nota", "¿Querés eliminar esta nota?", [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
      ]);
    });
    if (!confirm) return;
    try {
      await removeStorageByPublicUrl(n.image_url);
      const { error } = await supabase.from("notes").delete().eq("id", n.id).eq("user_id", userId!);
      if (error) throw error;
      if (editing?.id === n.id) setEditing(null);
      await fetchNotes();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo eliminar la nota.");
    }
  }

  function startEdit(n: Note) {
    setEditing({
      id: n.id,
      title: n.title ?? "",
      description: n.description ?? "",
      imageUri: undefined,
      saving: false,
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function saveEdit(original: Note) {
    if (!editing || !userId) return;
    try {
      setEditing({ ...editing, saving: true });

      let newImageUrl: string | null | undefined = undefined;
      if (editing.imageUri === null) {
        await removeStorageByPublicUrl(original.image_url);
        newImageUrl = null;
      } else if (typeof editing.imageUri === "string") {
        const uploaded = await uploadImageToStorage(editing.imageUri, userId);
        await removeStorageByPublicUrl(original.image_url);
        newImageUrl = uploaded;
      }

      const payload: any = {
        title: editing.title.trim() || null,
        description: editing.description.trim() || null,
      };
      if (newImageUrl !== undefined) payload.image_url = newImageUrl;

      const { error } = await supabase
        .from("notes")
        .update(payload)
        .eq("id", editing.id)
        .eq("user_id", userId);
      if (error) throw error;

      setEditing(null);
      await fetchNotes();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo actualizar la nota.");
      setEditing((prev) => (prev ? { ...prev, saving: false } : prev));
    }
  }

  return {
    notes,
    loadingList,
    refreshing,
    onRefresh,
    newTitle,
    setNewTitle,
    newDesc,
    setNewDesc,
    newImageUri,
    setNewImageUri,
    loadingCreate,
    addNote,
    editing,
    setEditing,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteNote,
    clearNotes,
  };
}

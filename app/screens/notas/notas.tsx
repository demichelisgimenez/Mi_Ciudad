import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { notasStyles as styles } from "@utils/styles/notas";
import { colors, sizes } from "@utils";
import { useAuth } from "@shared/context/AuthContext";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";
import type { RootStackParamList } from "@app/navigation/types";

import Button from "@components/Button";
import { useNotes } from "./hooks/use-notes";
import Composer from "./components/composer";
import Card from "./components/card";
import { pickImage } from "@utils/picker";
import { EditState } from "./types";

export default function NotasScreen() {
  const { state } = useAuth();
  const userId = state?.user?.id ?? null;
  const isLogged = !!userId;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const headerHeight = useHeaderHeight();
  const keyboardOffset =
    Platform.select({ ios: headerHeight - 10, android: headerHeight - 10 }) ?? 0;

  const {
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
  } = useNotes(userId);

  // refrescar al enfocar (útil después de login)
  useFocusEffect(
    useCallback(() => {
      if (isLogged) onRefresh();
    }, [isLogged, onRefresh])
  );

  const normalizedEditing: EditState = useMemo(() => editing, [editing]);

  async function handleEditImagePick(kind: "camera" | "library") {
    const uri = await pickImage(kind);
    if (!uri) return;
    setEditing((e) => (e ? { ...e, imageUri: uri } : e));
  }

  // Intercepta marcas "PICK_*" que vienen desde Card
  if (normalizedEditing && typeof normalizedEditing.imageUri === "string") {
    if (normalizedEditing.imageUri === ("PICK_CAMERA" as any)) {
      setEditing({ ...normalizedEditing, imageUri: undefined });
      handleEditImagePick("camera");
    } else if (normalizedEditing.imageUri === ("PICK_LIBRARY" as any)) {
      setEditing({ ...normalizedEditing, imageUri: undefined });
      handleEditImagePick("library");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right", "bottom"]} // 👈 sin "top" porque el header del Drawer ya empuja
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={[styles.container, { flex: 1 }]}>
          <Text style={styles.title}>Mis Notas</Text>

          {!isLogged ? (
            <>
              <View style={styles.authRow}>
                <Button
                  title="Iniciar Sesión"
                  icon="log-in-outline"
                  onPress={() =>
                    navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN })
                  }
                  fullWidth
                  style={{ marginRight: sizes.sm || 8 }}
                />
                <Button
                  title="Registrarme"
                  icon="person-add-outline"
                  variant="outline"
                  onPress={() =>
                    navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.REGISTER })
                  }
                  fullWidth
                />
              </View>
              <Text>Ingresá para crear y ver tus notas.</Text>
            </>
          ) : (
            <>
              <Composer
                title={newTitle}
                setTitle={setNewTitle}
                desc={newDesc}
                setDesc={setNewDesc}
                imageUri={newImageUri}
                setImageUri={setNewImageUri}
                loading={loadingCreate}
                onAdd={addNote}
                onPickCamera={async () => {
                  const uri = await pickImage("camera");
                  if (uri) setNewImageUri(uri);
                }}
                onPickLibrary={async () => {
                  const uri = await pickImage("library");
                  if (uri) setNewImageUri(uri);
                }}
              />

              <ScrollView
                style={styles.notesList}
                contentContainerStyle={[styles.notesListContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              >
                {loadingList ? (
                  <ActivityIndicator />
                ) : notes.length === 0 ? (
                  <Text style={styles.emptyText}>No tenés notas todavía.</Text>
                ) : (
                  notes.map((n) => (
                    <Card
                      key={n.id}
                      note={n}
                      editing={editing}
                      startEdit={startEdit}
                      cancelEdit={cancelEdit}
                      saveEdit={saveEdit}
                      setEditing={setEditing}
                      deleteNote={deleteNote}
                    />
                  ))
                )}
              </ScrollView>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

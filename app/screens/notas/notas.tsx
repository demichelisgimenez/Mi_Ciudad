import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Screen from "@app/screens/components/Screen";
import { notasStyles as styles } from "@utils/styles/notas";
import { colors } from "@utils";
import { useResponsive } from "@utils/responsive";
import { useAuth } from "@shared/context/AuthContext";
import { ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";
import type { RootStackParamList } from "@app/navigation/types";
import Button from "@components/Button";
import { useNotes } from "./hooks/use-notes";
import Composer from "./components/composer";
import Card from "./components/card";
import { pickImage } from "@utils/picker";
import { EditState } from "./types";

type NoteItem = any;

export default function NotasScreen() {
  const r = useResponsive();
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
    clearNotes,
  } = useNotes(userId);

  useFocusEffect(
    useCallback(() => {
      if (isLogged) onRefresh();
      else clearNotes();
    }, [isLogged, onRefresh, clearNotes])
  );

  const normalizedEditing: EditState = useMemo(() => editing, [editing]);

  useEffect(() => {
    if (normalizedEditing && typeof normalizedEditing.imageUri === "string") {
      if (normalizedEditing.imageUri === ("PICK_CAMERA" as any)) {
        setEditing({ ...normalizedEditing, imageUri: undefined });
        pickImage("camera").then((uri) => {
          if (uri) setNewImageUri(uri);
        });
      } else if (normalizedEditing.imageUri === ("PICK_LIBRARY" as any)) {
        setEditing({ ...normalizedEditing, imageUri: undefined });
        pickImage("library").then((uri) => {
          if (uri) setNewImageUri(uri);
        });
      }
    }
  }, [normalizedEditing, setEditing, setNewImageUri]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerMeasuredH, setHeaderMeasuredH] = useState(0);
  const listRef = useRef<Animated.FlatList<NoteItem>>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const [visibleCount, setVisibleCount] = useState(12);
  const pageStep = 10;
  const slicedData = isLogged ? (loadingList ? [] : notes).slice(0, visibleCount) : [];
  const canShowMore = isLogged && !loadingList && visibleCount < (notes?.length || 0);

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height || 0;
    if (Math.abs(h - headerMeasuredH) > 1) setHeaderMeasuredH(h);
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Math.max(headerMeasuredH, 1)],
    extrapolate: "clamp",
  });

  const contentPadTop = headerMeasuredH;

  const renderItem = ({ item }: ListRenderItemInfo<NoteItem>) => (
    <Card
      note={item}
      editing={editing}
      startEdit={startEdit}
      cancelEdit={cancelEdit}
      saveEdit={saveEdit}
      setEditing={setEditing}
      deleteNote={deleteNote}
    />
  );

  return (
    <Screen edges={["left", "right", "bottom"]} centerContent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={[styles.container, { flex: 1 }]}>
          <Animated.View
            onLayout={onHeaderLayout}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              transform: [{ translateY: headerTranslateY }],
              backgroundColor: colors.background,
              paddingBottom: r.isLandscape ? 8 : 12,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: (colors as any)?.border || "#ddd",
            }}
          >
            <Text style={[styles.title, { fontSize: r.titleSize, marginBottom: r.isLandscape ? 8 : 12 }]}>
              Mis Notas
            </Text>

            {!isLogged ? (
              <View style={{ paddingHorizontal: 8, marginBottom: r.isLandscape ? 8 : 12 }}>
                <View style={[styles.authRow, { marginBottom: 16, justifyContent: "center" }]}>
                  <View style={[styles.authBtn, { flex: 1, marginHorizontal: 4 }]}>
                    <Button
                      title="Iniciar Sesión"
                      icon="log-in-outline"
                      onPress={() =>
                        navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN } as never)
                      }
                      fullWidth
                    />
                  </View>
                  <View style={[styles.authBtn, { flex: 1, marginHorizontal: 4 }]}>
                    <Button
                      title="Registrarme"
                      icon="person-add-outline"
                      variant="outline"
                      onPress={() =>
                        navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.REGISTER } as never)
                      }
                      fullWidth
                    />
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: r.isTablet ? 18 : 14,
                    color: colors.textSecondary,
                    marginTop: 4,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                  }}
                >
                  Ingresá para crear y ver tus notas.
                </Text>
              </View>
            ) : (
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
                  setNewImageUri(uri ?? null);
                }}
                onPickLibrary={async () => {
                  const uri = await pickImage("library");
                  setNewImageUri(uri ?? null);
                }}
              />
            )}
          </Animated.View>

          <Animated.FlatList
            ref={listRef}
            data={slicedData}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={renderItem}
            style={styles.notesList}
            contentContainerStyle={[
              styles.notesListContent,
              { paddingTop: contentPadTop, paddingBottom: 0 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={isLogged ? refreshing : false}
                onRefresh={isLogged ? onRefresh : undefined}
              />
            }
            ListEmptyComponent={
              isLogged && !loadingList ? <Text style={styles.emptyText}>No tenés notas todavía.</Text> : null
            }
            ListFooterComponent={
              isLogged && (loadingList || canShowMore) ? <ActivityIndicator style={{ marginVertical: 8 }} /> : null
            }
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if (isLogged && canShowMore) {
                setVisibleCount((v) => Math.min(v + pageStep, notes.length));
              }
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
                listener: (e) => {
                  const y = (e as any).nativeEvent?.contentOffset?.y ?? 0;
                  setScrollPos(y);
                },
              }
            )}
            scrollEventThrottle={16}
            initialNumToRender={8}
            windowSize={10}
            maxToRenderPerBatch={8}
            removeClippedSubviews
          />

          {isLogged && scrollPos > headerMeasuredH + 60 && (
            <View
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                zIndex: 20,
              }}
            >
              <Button
                title="Nueva nota"
                icon="add"
                onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
                style={{ minWidth: r.isTablet ? 160 : 140 }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

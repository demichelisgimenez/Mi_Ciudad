import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
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
  TouchableOpacity,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Screen from "@app/screens/components/Screen";
import { notasStyles as styles } from "@utils/styles/notas";
import { colors } from "@utils";
import { useResponsive } from "@utils/responsive";
import { useAuth } from "@shared/context/AuthContext";
import { ROOT_ROUTES, AUTH_ROUTES, DRAWER_ROUTES } from "@utils/constants";
import type { RootStackParamList } from "@app/navigation/types";
import Button from "@components/Button";
import { useNotes } from "./hooks/use-notes";
import Composer from "./components/composer";
import Card from "./components/card";
import { pickImage } from "@utils/picker";
import { EditState, Note } from "./types";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NoteItem = any;
type ReminderMenuContext = "notificationsOff" | "noReminder" | "hasReminder";

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
    setNoteReminder,
    clearNoteReminder,
  } = useNotes(userId);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("notifications_enabled")
        .then((v) => {
          if (v === "0") setNotificationsEnabled(false);
          else setNotificationsEnabled(true);
        })
        .catch(() => {});
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (isLogged) onRefresh();
      else clearNotes();
    }, [isLogged, onRefresh, clearNotes])
  );

  const normalizedEditing: EditState = useMemo(() => editing, [editing]);

  useEffect(() => {
    if (!normalizedEditing) return;

    if (normalizedEditing.imageUri === ("PICK_CAMERA" as any)) {
      setEditing({ ...normalizedEditing, imageUri: undefined });
      pickImage("camera").then((uri) => {
        if (uri) {
          setEditing((prev) =>
            prev && prev.id === normalizedEditing.id
              ? { ...prev, imageUri: uri }
              : prev
          );
        }
      });
    } else if (normalizedEditing.imageUri === ("PICK_LIBRARY" as any)) {
      setEditing({ ...normalizedEditing, imageUri: undefined });
      pickImage("library").then((uri) => {
        if (uri) {
          setEditing((prev) =>
            prev && prev.id === normalizedEditing.id
              ? { ...prev, imageUri: uri }
              : prev
          );
        }
      });
    }
  }, [normalizedEditing, setEditing]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerMeasuredH, setHeaderMeasuredH] = useState(0);
  const listRef = useRef<Animated.FlatList<NoteItem>>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const [visibleCount, setVisibleCount] = useState(12);
  const pageStep = 10;
  const slicedData = isLogged ? (loadingList ? [] : notes).slice(0, visibleCount) : [];
  const canShowMore =
    isLogged && !loadingList && visibleCount < (notes?.length || 0);

  const [reminderNote, setReminderNote] = useState<Note | null>(null);
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [pickerStep, setPickerStep] =
    useState<"date" | "startTime" | "endTime" | null>(null);

  const [reminderMenuVisible, setReminderMenuVisible] = useState(false);
  const [reminderMenuNote, setReminderMenuNote] = useState<Note | null>(null);
  const [reminderMenuContext, setReminderMenuContext] =
    useState<ReminderMenuContext | null>(null);

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

  const handleOpenReminderPicker = (note: Note) => {
    const initial = note.reminder_start
      ? new Date(note.reminder_start)
      : new Date(Date.now() + 10 * 60 * 1000);
    setReminderNote(note);
    setBaseDate(initial);
    setStartDate(null);
    setPickerStep("date");
  };

  const handleReminderOptions = (note: Note, ctx: ReminderMenuContext) => {
    setReminderMenuNote(note);
    setReminderMenuContext(ctx);
    setReminderMenuVisible(true);
  };

  const closeReminderMenu = () => {
    setReminderMenuVisible(false);
    setReminderMenuNote(null);
    setReminderMenuContext(null);
  };

  const handleDateTimeChange = (event: any, selected?: Date) => {
    if (!pickerStep) return;

    if (Platform.OS === "android" && event?.type === "dismissed") {
      setPickerStep(null);
      setReminderNote(null);
      setStartDate(null);
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
    } else if (pickerStep === "startTime") {
      const start = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        selected.getHours(),
        selected.getMinutes()
      );
      setStartDate(start);
      setPickerStep("endTime");
    } else if (pickerStep === "endTime") {
      if (!reminderNote) {
        setPickerStep(null);
        setStartDate(null);
        setReminderNote(null);
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
      const targetNote = reminderNote;
      setPickerStep(null);
      setStartDate(null);
      setReminderNote(null);
      setNoteReminder(targetNote, finalStart, end);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<NoteItem>) => (
    <Card
      note={item}
      editing={editing}
      startEdit={startEdit}
      cancelEdit={cancelEdit}
      saveEdit={saveEdit}
      setEditing={setEditing}
      deleteNote={deleteNote}
      onOpenReminderMenu={handleOpenReminderPicker}
      onClearReminder={clearNoteReminder}
      notificationsEnabled={notificationsEnabled}
      onReminderOptionsRequested={handleReminderOptions}
    />
  );

  let menuEmoji = "";
  let menuIconStyle = styles.reminderMenuIconCircleReminder;

  if (reminderMenuContext === "notificationsOff") {
    menuEmoji = "🔔";
    menuIconStyle = styles.reminderMenuIconCircleNotification;
  } else if (reminderMenuContext === "noReminder") {
    menuEmoji = "⏰";
    menuIconStyle = styles.reminderMenuIconCircleReminder;
  } else if (reminderMenuContext === "hasReminder") {
    menuEmoji = "✏️";
    menuIconStyle = styles.reminderMenuIconCircleEdit;
  }

  let menuTitle = "";
  let menuText = "";
  let primaryLabel = "";
  let secondaryLabel = "";
  let tertiaryLabel: string | null = null;

  if (reminderMenuContext === "notificationsOff") {
    menuTitle = "Activar notificaciones";
    menuText =
      "Para agregar recordatorios necesitás activar las notificaciones en Ajustes.";
    primaryLabel = "Ir a Ajustes";
    secondaryLabel = "Cerrar";
  } else if (reminderMenuContext === "noReminder") {
    menuTitle = "Agregar recordatorio";
    menuText =
      "Vas a elegir una fecha y un rango horario para esta nota. Te avisamos al inicio.";
    primaryLabel = "Elegir fecha y hora";
    secondaryLabel = "Cancelar";
  } else if (reminderMenuContext === "hasReminder") {
  menuTitle = "Recordatorio de esta nota";
  menuText =
    "Podés cambiar el rango horario o quitar el recordatorio si ya no lo necesitás.";
  primaryLabel = "Editar";
  secondaryLabel = "Cancelar";
  tertiaryLabel = "Borrar";
  }


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
            <Text
              style={[
                styles.title,
                { fontSize: r.titleSize, marginBottom: r.isLandscape ? 8 : 12 },
              ]}
            >
              Mis Notas
            </Text>

            {!isLogged ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  marginBottom: r.isLandscape ? 8 : 12,
                }}
              >
                <View
                  style={[
                    styles.authRow,
                    { marginBottom: 16, justifyContent: "center" },
                  ]}
                >
                  <View style={[styles.authBtn, { flex: 1, marginHorizontal: 4 }]}>
                    <Button
                      title="Iniciar Sesión"
                      icon="log-in-outline"
                      onPress={() =>
                        navigation.navigate(ROOT_ROUTES.AUTH, {
                          screen: AUTH_ROUTES.LOGIN,
                        } as never)
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
                        navigation.navigate(ROOT_ROUTES.AUTH, {
                          screen: AUTH_ROUTES.REGISTER,
                        } as never)
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
              isLogged && !loadingList ? (
                <Text style={styles.emptyText}>No tenés notas todavía.</Text>
              ) : null
            }
            ListFooterComponent={
              isLogged && (loadingList || canShowMore) ? (
                <ActivityIndicator style={{ marginVertical: 8 }} />
              ) : null
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
                onPress={() =>
                  listRef.current?.scrollToOffset({ offset: 0, animated: true })
                }
                style={{ minWidth: r.isTablet ? 160 : 140 }}
              />
            </View>
          )}

          {pickerStep && reminderNote && (
            <DateTimePicker
              value={baseDate}
              mode={pickerStep === "date" ? "date" : "time"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateTimeChange}
            />
          )}

          {reminderMenuVisible &&
            reminderMenuNote &&
            reminderMenuContext && (
              <View style={styles.reminderMenuOverlay}>
                <View style={styles.reminderMenuCard}>
                  <View style={[styles.reminderMenuIconCircle, menuIconStyle]}>
                    <Text style={styles.reminderMenuIconEmoji}>{menuEmoji}</Text>
                  </View>
                  <Text style={styles.reminderMenuTitle}>{menuTitle}</Text>
                  <Text style={styles.reminderMenuText}>{menuText}</Text>

                  {reminderMenuContext === "noReminder" && (
                    <View style={styles.reminderStepsContainer}>
                      <View style={styles.reminderStep}>
                        <View style={styles.reminderStepCircle}>
                          <Text style={styles.reminderStepNumber}>1</Text>
                        </View>
                        <View style={styles.reminderStepContent}>
                          <Text style={styles.reminderStepTitle}>
                            Seleccioná la fecha
                          </Text>
                          <Text style={styles.reminderStepDescription}>
                            Tocá el calendario y elegí el día del recordatorio.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.reminderStep}>
                        <View style={styles.reminderStepCircle}>
                          <Text style={styles.reminderStepNumber}>2</Text>
                        </View>
                        <View style={styles.reminderStepContent}>
                          <Text style={styles.reminderStepTitle}>
                            Hora de inicio
                          </Text>
                          <Text style={styles.reminderStepDescription}>
                            Usá el reloj para definir cuándo empieza el
                            recordatorio.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.reminderStep}>
                        <View style={styles.reminderStepCircle}>
                          <Text style={styles.reminderStepNumber}>3</Text>
                        </View>
                        <View style={styles.reminderStepContent}>
                          <Text style={styles.reminderStepTitle}>
                            Hora de fin
                          </Text>
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
                      onPress={() => {
                        if (reminderMenuContext === "notificationsOff") {
                          closeReminderMenu();
                          navigation.navigate(DRAWER_ROUTES.AJUSTES as never);
                        } else if (
                          reminderMenuContext === "noReminder" ||
                          reminderMenuContext === "hasReminder"
                        ) {
                          const n = reminderMenuNote;
                          closeReminderMenu();
                          if (n) {
                            handleOpenReminderPicker(n);
                          }
                        }
                      }}
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
                      style={[
                        styles.reminderMenuBtn,
                        styles.reminderMenuBtnSecondary,
                      ]}
                      onPress={closeReminderMenu}
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

                  {tertiaryLabel && (
                    <View style={styles.reminderMenuButtonsRowSecondary}>
                      <TouchableOpacity
                        style={[
                          styles.reminderMenuBtn,
                          styles.reminderMenuBtnDanger,
                        ]}
                        onPress={() => {
                          const n = reminderMenuNote;
                          closeReminderMenu();
                          if (n) {
                            clearNoteReminder(n);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.reminderMenuBtnText,
                            styles.reminderMenuBtnTextDanger,
                          ]}
                        >
                          {tertiaryLabel}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

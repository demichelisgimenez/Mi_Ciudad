import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Keyboard,
  Linking,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { escuelaStyles as styles } from "@utils/styles/escuelas";
import { supabase } from "@utils/supabase";

type Level =
  | "Inicial"
  | "Primaria"
  | "Secundaria"
  | "Técnica"
  | "Superior"
  | "Especial"
  | "Adultos";

type School = {
  id: string;
  name: string;
  address?: string | null;
  cue?: string | null;
  phone?: string | null;
  email?: string | null;
  level: Level;
  lat: number;
  lng: number;
  city?: string | null;
  province?: string | null;
  department?: string | null;
};

const LEVELS: (Level | "Todos")[] = [
  "Todos",
  "Inicial",
  "Primaria",
  "Secundaria",
  "Técnica",
  "Superior",
  "Especial",
  "Adultos",
];

const INITIAL_REGION: Region = {
  latitude: -30.9546,
  longitude: -58.7833,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const { height: SCREEN_H } = Dimensions.get("window");

const PIN_IMG: Record<Level, any> = {
  Inicial: require("../../../assets/pins/pin-inicial.png"),
  Primaria: require("../../../assets/pins/pin-primaria.png"),
  Secundaria: require("../../../assets/pins/pin-secundaria.png"),
  Técnica: require("../../../assets/pins/pin-tecnica.png"),
  Superior: require("../../../assets/pins/pin-superior.png"),
  Especial: require("../../../assets/pins/pin-especial.png"),
  Adultos: require("../../../assets/pins/pin-adultos.png"),
};

function MarkerEscuela({
  school,
  selected,
  onPress,
}: {
  school: School;
  selected: boolean;
  onPress: (s: School) => void;
}) {
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 300);
    return () => clearTimeout(t);
  }, [school.id]);

  return (
    <Marker
      coordinate={{ latitude: school.lat, longitude: school.lng }}
      tracksViewChanges={tracks}
      onPress={() => onPress(school)}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 999 : 1}
    >
      <View
        style={styles.markerContainer}
        collapsable={false}
        renderToHardwareTextureAndroid
        pointerEvents="none"
      >
        <Image source={PIN_IMG[school.level]} style={styles.markerImage} />
      </View>
    </Marker>
  );
}

export default function Escuelas() {
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<School>>(null);
  const lastCenteredId = useRef<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [level, setLevel] = useState<Level | "Todos">("Todos");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<School | null>(null);
  const [kbHeight, setKbHeight] = useState(0);

  // Bottom sheet minimizable
  const SNAP_MIN = 44; // minimizado
  const SNAP_MID = Math.max(Math.round(SCREEN_H * 0.42), 320);
  const SNAP_MAX = Math.max(Math.round(SCREEN_H * 0.86), 480);

  const sheetHeight = useRef(new Animated.Value(SNAP_MID)).current;
  const heightValue = useRef(SNAP_MID);
  sheetHeight.addListener(({ value }) => (heightValue.current = value));
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderMove: (_, g) => {
        const next = clamp(heightValue.current - g.dy, SNAP_MIN, SNAP_MAX);
        sheetHeight.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const current = heightValue.current;
        const biased = current + (g.vy > 0.35 ? -120 : g.vy < -0.35 ? 120 : 0);
        const snaps = [SNAP_MIN, SNAP_MID, SNAP_MAX];
        const nearest = snaps.reduce((a, b) =>
          Math.abs(b - biased) < Math.abs(a - biased) ? b : a
        );
        Animated.spring(sheetHeight, {
          toValue: nearest,
          useNativeDriver: false,
          tension: 160,
          friction: 18,
        }).start();
      },
    })
  ).current;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 200);
    return () => clearTimeout(t);
  }, [queryInput]);

  // teclado
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e: any) =>
      setKbHeight(e?.endCoordinates?.height ?? 0)
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKbHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("schools")
          .select(
            "id,name,address,city,province,department,cue,phone,email,level,lat,lng"
          )
          .eq("department", "Federal")
          .order("name", { ascending: true });
        if (error) throw error;
        if (alive) setSchools((data ?? []) as School[]);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar escuelas");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // filtros
  const filtered = useMemo(() => {
    const base =
      level === "Todos" ? schools : schools.filter((s) => s.level === level);
    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.address ?? "").toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q) ||
        (s.cue ?? "").toLowerCase().includes(q)
    );
  }, [schools, level, query]);

  // índice por id (para scrollear a la tarjeta al tocar pin)
  const idToIndex = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((s, i) => m.set(s.id, i));
    return m;
  }, [filtered]);

  const markersToShow: School[] = selected ? [selected] : filtered;

  const animateToSchool = useCallback((s: School) => {
    if (lastCenteredId.current === s.id) return;
    lastCenteredId.current = s.id;
    mapRef.current?.animateToRegion(
      {
        latitude: s.lat,
        longitude: s.lng,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,
      },
      400
    );
  }, []);

  const handleSelectFromList = useCallback(
    (s: School, index: number) => {
      setSelected(s);
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.02,
      });
      requestAnimationFrame(() => animateToSchool(s));
    },
    [animateToSchool]
  );

  const handleMarkerPress = useCallback(
    (s: School) => {
      setSelected(s);
      animateToSchool(s);

      // 1) Expandir a MID si estaba minimizado
      const ensureExpanded = () => {
        if (heightValue.current < SNAP_MID) {
          return new Promise<void>((res) => {
            Animated.spring(sheetHeight, {
              toValue: SNAP_MID,
              useNativeDriver: false,
            }).start(() => res());
          });
        }
        return Promise.resolve();
      };

      // 2) Buscar índice y scrollear con una pequeña espera para que mida
      const idx = idToIndex.get(s.id);
      if (idx !== undefined) {
        ensureExpanded().then(() => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: idx,
              animated: true,
              viewPosition: 0.02,
            });
          }, 120);
        });
      }
    },
    [animateToSchool, idToIndex, sheetHeight]
  );

  // acciones
  const call = (phone?: string | null) => {
    if (!phone) return;
    const normalized = phone.replace(/[^\d+]/g, "");
    Linking.openURL(`tel:${normalized}`).catch(() => {});
  };
  const navigateTo = (s: School) => {
    const label = encodeURIComponent(s.name);
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?q=${label}&ll=${s.lat},${s.lng}`
        : `geo:${s.lat},${s.lng}?q=${s.lat},${s.lng}(${label})`;
    Linking.openURL(url).catch(() => {});
  };

  // item lista
  const SchoolItem = React.useMemo(
    () =>
      React.memo(function SchoolItem({
        item,
        active,
        onPress,
      }: {
        item: School;
        active: boolean;
        onPress: () => void;
      }) {
        return (
          <TouchableOpacity
            style={[styles.card, active && styles.cardActive]}
            onPress={onPress}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.levelDot,
                  { backgroundColor: styles.levelColor[item.level] },
                ]}
              />
              <Text style={styles.nombre}>{item.name}</Text>
            </View>

            {!!item.address && (
              <Text style={styles.direccion}>
                📍 {item.address}
                {item.city ? `, ${item.city}` : ""}
              </Text>
            )}

            <View style={styles.cardFooter}>
              <View
                style={[
                  styles.pill,
                  { backgroundColor: styles.levelColor[item.level] },
                ]}
              >
                <Text style={styles.pillText}>{item.level}</Text>
              </View>
              <Text style={styles.metaText}>
                {item.phone ? `📞 ${item.phone}` : ""}
              </Text>
            </View>

            {active && (
              <View style={styles.detailBox}>
                {item.cue ? (
                  <Text style={styles.detailLine}>CUE: {item.cue}</Text>
                ) : null}
                {item.email ? (
                  <Text style={styles.detailLine}>✉️ {item.email}</Text>
                ) : null}
                {item.phone ? (
                  <Text style={styles.detailLine}>📞 {item.phone}</Text>
                ) : null}

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => call(item.phone)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="call" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Llamar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigateTo(item)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="navigate" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Cómo llegar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      setSelected(null);
                      lastCenteredId.current = null;
                    }}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="arrow-back" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Volver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: School; index: number }) => {
      const active = selected?.id === item.id;
      return (
        <SchoolItem
          item={item}
          active={!!active}
          onPress={() => handleSelectFromList(item, index)}
        />
      );
    },
    [selected?.id, handleSelectFromList, SchoolItem]
  );

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsCompass={false}
        toolbarEnabled={false}
        loadingEnabled
      >
        {markersToShow.map((s) => (
          <MarkerEscuela
            key={s.id}
            school={s}
            selected={selected?.id === s.id}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* overlay título */}
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Escuelas de Federal</Text>
      </View>

      {/* Bottom Sheet DESLIZABLE */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: Animated.add(
              sheetHeight,
              new Animated.Value(kbHeight > 0 ? kbHeight : 0)
            ),
          },
        ]}
      >
        {/* overlay invisible para ampliar área de arrastre */}
        <View
          {...pan.panHandlers}
          style={styles.gestureOverlay}
          pointerEvents="box-only"
        />

        {/* Handle visible */}
        <View
          {...pan.panHandlers}
          style={styles.dragStrip}
          hitSlop={{ top: 10, bottom: 20 }}
        >
          <View style={styles.handleBar} />
        </View>

        {/* Filtros */}
        <View style={styles.filtersRow}>
          <FlatList
            data={LEVELS}
            horizontal
            keyExtractor={(l) => String(l)}
            renderItem={({ item }) => {
              const active = level === item;
              return (
                <TouchableOpacity
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => {
                    setLevel(item);
                    setSelected(null);
                    lastCenteredId.current = null;
                  }}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* Buscador */}
        <TextInput
          placeholder="Buscar por nombre, dirección o CUE…"
          placeholderTextColor="#8A8A8A"
          value={queryInput}
          onChangeText={setQueryInput}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          blurOnSubmit
        />

        {/* Lista */}
        <View style={styles.listWrapper}>
          <FlatList
            ref={listRef}
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={45}
            windowSize={7}
            onScrollToIndexFailed={(info) => {
              const approx = info.averageItemLength
                ? info.averageItemLength * info.index
                : 120 * info.index;
              listRef.current?.scrollToOffset({ offset: approx, animated: true });
              setTimeout(() => {
                listRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.02,
                });
              }, 120);
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {loading
                    ? "Cargando…"
                    : "No se encontraron escuelas con los filtros aplicados"}
                </Text>
              </View>
            }
          />
        </View>
      </Animated.View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

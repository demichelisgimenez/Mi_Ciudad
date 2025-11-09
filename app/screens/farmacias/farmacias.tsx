// app/screens/farmacias/farmacias.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Platform,
  Keyboard,
  Linking,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";
import { supabase } from "@utils/supabase";

type TimeRange = { from: string; to: string };
type Hours = { weekday?: TimeRange[]; saturday?: TimeRange[] };

type Pharmacy = {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  hours?: Hours | null;
  lat: number;
  lng: number;
  city?: string | null;
  province?: string | null;
  department?: string | null;
};

const FILTERS = ["Todas", "Abierto ahora"] as const;
type Filter = typeof FILTERS[number];

const INITIAL_REGION: Region = {
  latitude: -30.9546,
  longitude: -58.7833,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const { height: SCREEN_H } = Dimensions.get("window");

// ===== Helpers horarios
function parseHM(s: string): { h: number; m: number } {
  const [h, m] = s.split(":").map((x) => parseInt(x, 10));
  return { h: h || 0, m: m || 0 };
}
function minutes(hm: { h: number; m: number }) {
  return hm.h * 60 + hm.m;
}
function nowLocalMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
function isOpenAt(hours: Hours | null | undefined, date = new Date()): boolean {
  if (!hours) return false;
  const day = date.getDay(); // 0 domingo, 6 sábado
  const todayRanges: TimeRange[] =
    day === 6 ? hours.saturday ?? [] : day === 0 ? [] : hours.weekday ?? [];
  if (!todayRanges.length) return false;
  const n = nowLocalMinutes();
  return todayRanges.some(({ from, to }) => {
    const nFrom = minutes(parseHM(from));
    const nTo = minutes(parseHM(to));
    return n >= nFrom && n <= nTo;
  });
}
function todayLabel(hours?: Hours | null): string {
  if (!hours) return "Sin horarios";
  const day = new Date().getDay();
  const arr: TimeRange[] =
    day === 6 ? hours.saturday ?? [] : day === 0 ? [] : hours.weekday ?? [];
  if (!arr.length) return day === 0 ? "Domingo: cerrado" : "Hoy: cerrado";
  const slots = arr.map((r) => `${r.from}–${r.to}`).join(" · ");
  return `Hoy: ${slots}`;
}

// ===== Marker
function MarkerFarmacia({
  f,
  selected,
  onPress,
}: {
  f: Pharmacy;
  selected: boolean;
  onPress: (p: Pharmacy) => void;
}) {
  const [tracks, setTracks] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 300);
    return () => clearTimeout(t);
  }, [f.id]);

  const containerStyle = selected
    ? styles.markerContainerSelected
    : styles.markerContainerDefault;

  return (
    <Marker
      coordinate={{ latitude: f.lat, longitude: f.lng }}
      onPress={() => onPress(f)}
      tracksViewChanges={tracks}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 999 : 1}
    >
      <View
        style={containerStyle}
        collapsable={false}
        renderToHardwareTextureAndroid
        pointerEvents="none"
      >
        <Image
          source={require("../../../assets/pins/pin-farmacia.png")}
          style={styles.markerImage}
        />
      </View>
    </Marker>
  );
}

// ===== Pantalla principal
export default function Farmacias() {
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<Pharmacy>>(null);
  const lastCenteredId = useRef<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Pharmacy[]>([]);
  const [filter, setFilter] = useState<Filter>("Todas");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pharmacy | null>(null);
  const [kbHeight, setKbHeight] = useState(0);

  // ===== Bottom sheet
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
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        const next = clamp(heightValue.current - g.dy, SNAP_MIN, SNAP_MAX);
        sheetHeight.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const current = heightValue.current;
        const snaps = [SNAP_MIN, SNAP_MID, SNAP_MAX];
        const biased = current + (g.vy > 0.5 ? -60 : g.vy < -0.5 ? 60 : 0);
        const nearest = snaps.reduce((a, b) =>
          Math.abs(b - biased) < Math.abs(a - biased) ? b : a
        );
        Animated.spring(sheetHeight, {
          toValue: nearest,
          useNativeDriver: false,
          tension: 180,
          friction: 22,
        }).start();
      },
    })
  ).current;

  // ===== debounce search
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 220);
    return () => clearTimeout(t);
  }, [queryInput]);

  // ===== teclado
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

  // ===== fetch datos
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pharmacies")
          .select(
            "id,name,address,phone,hours,lat,lng,city,province,department"
          )
          .eq("department", "Federal")
          .order("name", { ascending: true });
        if (error) throw error;
        if (alive) setItems((data ?? []) as Pharmacy[]);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar farmacias");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ===== filtrado
  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        (it.address ?? "").toLowerCase().includes(q) ||
        (it.phone ?? "").toLowerCase().includes(q)
      );
    });
    if (filter === "Abierto ahora") {
      return base.filter((f) => isOpenAt(f.hours));
    }
    return base;
  }, [items, filter, query]);

  // Índice para scrollear al tocar el pin
  const idToIndex = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((f, i) => m.set(f.id, i));
    return m;
  }, [filtered]);

  const markersToShow: Pharmacy[] = selected ? [selected] : filtered;

  // ===== cámara
  const animateTo = useCallback((f: Pharmacy) => {
    if (lastCenteredId.current === f.id) return;
    lastCenteredId.current = f.id;

    mapRef.current?.animateToRegion(
      { latitude: f.lat, longitude: f.lng, latitudeDelta: 0.006, longitudeDelta: 0.006 },
      380
    );
  }, []);

  // ===== selección desde la lista
  const handleSelectFromList = useCallback(
    (f: Pharmacy, index: number) => {
      setSelected(f);
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.02 });
      requestAnimationFrame(() => animateTo(f));
    },
    [animateTo]
  );

  // ===== selección desde el mapa → scroll a la tarjeta
  const handleMarkerPress = useCallback(
    (f: Pharmacy) => {
      setSelected(f);
      animateTo(f);

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

      const idx = idToIndex.get(f.id);
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
    [idToIndex, animateTo, sheetHeight]
  );

  // ===== acciones
  const call = (phone?: string | null) => {
    if (!phone) return;
    const normalized = phone.replace(/[^\d+]/g, "");
    Linking.openURL(`tel:${normalized}`).catch(() => {});
  };
  const navigateTo = (f: Pharmacy) => {
    const label = encodeURIComponent(f.name);
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?q=${label}&ll=${f.lat},${f.lng}`
        : `geo:${f.lat},${f.lng}?q=${f.lat},${f.lng}(${label})`;
    Linking.openURL(url).catch(() => {});
  };

  // ===== Item de lista
  const Item = React.useMemo(
    () =>
      React.memo(function Item({
        item,
        active,
        onPress,
      }: {
        item: Pharmacy;
        active: boolean;
        onPress: () => void;
      }) {
        const open = isOpenAt(item.hours);

        return (
          <TouchableOpacity
            style={[styles.card, active && styles.cardActive]}
            onPress={onPress}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Image
                source={require("../../../assets/pins/pin-farmacia.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={open ? styles.pillOpen : styles.pillClosed}>
                <Text style={styles.pillText}>{open ? "Abierto" : "Cerrado"}</Text>
              </View>
            </View>

            {!!item.address && <Text style={styles.cardAddress}>📍 {item.address}</Text>}
            {!!item.phone && <Text style={styles.cardMeta}>📞 {item.phone}</Text>}

            <Text style={styles.cardMeta}>{todayLabel(item.hours ?? undefined)}</Text>

            {active && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailLine}>
                  Lunes a viernes:{" "}
                  {(item.hours?.weekday ?? [])
                    .map((r) => `${r.from}–${r.to}`)
                    .join("  ·  ") || "—"}
                </Text>
                <Text style={styles.detailLine}>
                  Sábado:{" "}
                  {(item.hours?.saturday ?? [])
                    .map((r) => `${r.from}–${r.to}`)
                    .join("  ·  ") || "—"}
                </Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => call(item.phone)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="call" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Llamar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigateTo(item)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="navigate" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Cómo llegar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setSelected(null);
                      lastCenteredId.current = null;
                    }}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="arrow-back" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Volver</Text>
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
    ({ item, index }: { item: Pharmacy; index: number }) => {
      const active = selected?.id === item.id;
      return <Item item={item} active={!!active} onPress={() => handleSelectFromList(item, index)} />;
    },
    [selected?.id, handleSelectFromList, Item]
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
        {markersToShow.map((f) => (
          <MarkerFarmacia
            key={f.id}
            f={f}
            selected={selected?.id === f.id}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* Overlay título */}
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Farmacias de Federal</Text>
      </View>

      {/* Bottom Sheet */}
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
        {/* Área invisible grande para arrastrar */}
        <View {...pan.panHandlers} style={styles.dragHitbox} pointerEvents="box-only" />

        {/* Handle visible */}
        <View {...pan.panHandlers} style={styles.dragStrip} hitSlop={{ top: 10, bottom: 20 }}>
          <View style={styles.handleBar} />
        </View>

        {/* Filtros */}
        <View style={styles.filtersRow}>
          <FlatList
            data={FILTERS as unknown as string[]}
            horizontal
            keyExtractor={(v) => v}
            renderItem={({ item }) => {
              const active = filter === (item as Filter);
              return (
                <TouchableOpacity
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => {
                    setFilter(item as Filter);
                    setSelected(null);
                    lastCenteredId.current = null;
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
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
          placeholder="Buscar por nombre, dirección o teléfono…"
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
                  {loading ? "Cargando…" : "No se encontraron farmacias"}
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

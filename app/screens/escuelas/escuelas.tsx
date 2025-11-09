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
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { escuelaStyles as styles } from "@utils/styles/escuelas";
import { supabase } from "@utils/supabase";

type Level = "Inicial" | "Primaria" | "Secundaria" | "Técnica" | "Superior" | "Especial" | "Adultos";

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
  "Todos", "Inicial", "Primaria", "Secundaria", "Técnica", "Superior", "Especial", "Adultos",
];

const INITIAL_REGION: Region = {
  latitude: -30.9546,
  longitude: -58.7833,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const { height: SCREEN_H } = Dimensions.get("window");

const PIN_IMG: Record<Level, any> = {
  Inicial:    require("../../../assets/pins/pin-inicial.png"),
  Primaria:   require("../../../assets/pins/pin-primaria.png"),
  Secundaria: require("../../../assets/pins/pin-secundaria.png"),
  Técnica:    require("../../../assets/pins/pin-tecnica.png"),
  Superior:   require("../../../assets/pins/pin-superior.png"),
  Especial:   require("../../../assets/pins/pin-especial.png"),
  Adultos:    require("../../../assets/pins/pin-adultos.png"),
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
        style={{ width: 40, height: 40 }}
        collapsable={false}
        renderToHardwareTextureAndroid
        pointerEvents="none"
      >
        <Image
          source={PIN_IMG[school.level]}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          fadeDuration={0}
        />
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

  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 200);
    return () => clearTimeout(t);
  }, [queryInput]);

  const LIST_MAX = selected ? Math.max(SCREEN_H * 0.28, 220) : Math.max(SCREEN_H * 0.40, 260);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e: any) => setKbHeight(e?.endCoordinates?.height ?? 0));
    const hideSub = Keyboard.addListener(hideEvent, () => setKbHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("schools")
          .select("id,name,address,city,province,department,cue,phone,email,level,lat,lng")
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
    return () => { alive = false; };
  }, []);

  // Filtrado
  const filtered = useMemo(() => {
    const base = level === "Todos" ? schools : schools.filter((s) => s.level === level);
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


  const markersToShow: School[] = selected ? [selected] : filtered;

  const animateToSchool = useCallback((s: School) => {
    if (lastCenteredId.current === s.id) return;
    lastCenteredId.current = s.id;
    // @ts-ignore
    mapRef.current?.setMapPadding?.({ bottom: Math.round(LIST_MAX) + 16, top: 16, left: 12, right: 12 });
    mapRef.current?.animateToRegion(
      { latitude: s.lat, longitude: s.lng, latitudeDelta: 0.006, longitudeDelta: 0.006 },
      400
    );
  }, [LIST_MAX]);

  const handleSelectFromList = useCallback(
    (s: School, index: number) => {
      setSelected(s);
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.02 });
      requestAnimationFrame(() => animateToSchool(s));
    },
    [animateToSchool]
  );

  const handleMarkerPress = useCallback(
    (s: School) => {
      setSelected(s);
      animateToSchool(s);
    },
    [animateToSchool]
  );

  const onChangeLevel = (value: Level | "Todos") => {
    setLevel(value);
    setSelected(null);
    lastCenteredId.current = null;
  };

  const SchoolItem = React.useMemo(
    () =>
      React.memo(function SchoolItem({
        item,
        active,
        onPress,
      }: { item: School; active: boolean; onPress: () => void }) {
        return (
          <TouchableOpacity style={[styles.card, active && styles.cardActive]} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.cardHeader}>
              <View style={[styles.levelDot, { backgroundColor: styles.levelColor[item.level] }]} />
              <Text style={styles.nombre}>{item.name}</Text>
            </View>

            {!!item.address && (
              <Text style={styles.direccion}>
                📍 {item.address}
                {item.city ? `, ${item.city}` : ""}
              </Text>
            )}

            <View style={styles.cardFooter}>
              <View style={[styles.pill, { backgroundColor: styles.levelColor[item.level] }]}>
                <Text style={styles.pillText}>{item.level}</Text>
              </View>
              <Text style={styles.metaText}>{item.phone ? `📞 ${item.phone}` : ""}</Text>
            </View>

            {active && (
              <View style={styles.detailBox}>
                {item.cue ? <Text style={styles.detailLine}>CUE: {item.cue}</Text> : null}
                {item.email ? <Text style={styles.detailLine}>✉️ {item.email}</Text> : null}
                {item.phone ? <Text style={styles.detailLine}>📞 {item.phone}</Text> : null}
                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => { setSelected(null); lastCenteredId.current = null; }}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="arrow-back" size={16} color="#fff" />
                    <Text style={styles.backBtnText}>Volver</Text>
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
      return <SchoolItem item={item} active={!!active} onPress={() => handleSelectFromList(item, index)} />;
    },
    [selected?.id, handleSelectFromList, SchoolItem]
  );

  return (
    <View style={styles.container}>
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

      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Escuelas de Federal</Text>
      </View>

      <View style={styles.bottomSheet}>
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
                  onPress={() => onChangeLevel(item)}
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

        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            kbHeight > 0 ? { paddingBottom: kbHeight + 12 } : null,
          ]}
          style={{ maxHeight: LIST_MAX, minHeight: 220, marginHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={45}
          windowSize={7}
          ListEmptyComponent={
            <View style={{ paddingVertical: 24, minHeight: 180, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#A9A9A9", fontStyle: "italic", textAlign: "center" }}>
                No se encontraron escuelas con los filtros aplicados
              </Text>
            </View>
          }
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

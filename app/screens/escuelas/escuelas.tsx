import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Linking, Platform } from "react-native";
import MapView, { Region } from "react-native-maps";
import { escuelaStyles as styles } from "@utils/styles/escuelas";
import { useBottomSheet } from "./hooks/useBottomSheet";
import { useSchools } from "./hooks/useSchools";
import { LEVELS, School } from "./types";

import { BottomSheet } from "./components/BottomSheet";
import { FiltersBar } from "./components/FiltersBar";
import { SearchInput } from "./components/SearchInput";
import { ListEmpty } from "./components/ListEmpty";
import { SchoolList } from "./components/SchoolList";
import { MarkerEscuela } from "./components/MarkerEscuela";

const INITIAL_REGION: Region = {
  latitude: -30.9546,
  longitude: -58.7833,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

export default function Escuelas() {
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<any>(null);
  const lastCenteredId = useRef<string | null>(null);

  const [selected, setSelected] = useState<School | null>(null);

  const {
    loading, error, filtered, idToIndex,
    level, setLevel, queryInput, setQueryInput, kbHeight
  } = useSchools();

  const { sheetHeight, pan, ensureExpandedToMid } = useBottomSheet();

  const markersToShow: School[] = useMemo(
    () => (selected ? [selected] : filtered),
    [selected, filtered]
  );

  const animateToSchool = useCallback((s: School) => {
    if (lastCenteredId.current === s.id) return;
    lastCenteredId.current = s.id;
    mapRef.current?.animateToRegion(
      { latitude: s.lat, longitude: s.lng, latitudeDelta: 0.006, longitudeDelta: 0.006 },
      400
    );
  }, []);

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

      const idx = idToIndex.get(s.id);
      if (idx !== undefined) {
        ensureExpandedToMid().then(() => {
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
    [animateToSchool, idToIndex, ensureExpandedToMid]
  );

  // Acciones
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

  return (
    <View style={styles.container}>
      {/* Mapa */}
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

      {/* Título */}
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Escuelas de Federal</Text>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet heightAnimated={sheetHeight} kbHeight={kbHeight} panHandlers={pan.panHandlers}>
        <FiltersBar
          data={LEVELS}
          active={level}
          onChange={(v) => {
            setLevel(v);
            setSelected(null);
            lastCenteredId.current = null;
          }}
        />

        <SearchInput value={queryInput} onChangeText={setQueryInput} />

        <View style={styles.listWrapper}>
          {filtered.length === 0 ? (
            <ListEmpty loading={loading} />
          ) : (
            <SchoolList
              data={filtered}
              selectedId={selected?.id ?? null}
              loading={loading}
              onSelect={handleSelectFromList}
              onCall={(s) => call(s.phone)}
              onNavigate={(s) => navigateTo(s)}
              onClearSelection={() => {
                setSelected(null);
                lastCenteredId.current = null;
              }}
              listRef={listRef}
            />
          )}
        </View>
      </BottomSheet>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, FlatList, Platform, Keyboard, Linking, Animated } from "react-native";
import MapView, { Region } from "react-native-maps";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";
import { useBottomSheet } from "./hooks/useBottomSheet";
import { usePharmacies } from "./hooks/usePharmacies";
import DragHandle from "./components/DragHandle";
import EmptyList from "./components/EmptyList";
import FiltersChips from "./components/FiltersChips";
import MarkerFarmacia from "./components/MarkerFarmacia";
import FarmaciaItem from "./components/FarmaciaItem";
import type { Pharmacy, Filter } from "./types";

const FILTERS = ["Todas", "Abierto ahora"] as const;
const INITIAL_REGION: Region = { latitude: -30.9546, longitude: -58.7833, latitudeDelta: 0.25, longitudeDelta: 0.25 };

export default function Farmacias() {
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<Pharmacy>>(null);
  const lastCenteredId = useRef<string | null>(null);

  const [filter, setFilter] = useState<Filter>("Todas");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pharmacy | null>(null);
  const [kbHeight, setKbHeight] = useState(0);

  const { sheetHeight, pan, ensureExpanded } = useBottomSheet();
  const { loading, error, filtered, idToIndex } = usePharmacies(filter, query);

  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 220);
    return () => clearTimeout(t);
  }, [queryInput]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e: any) => setKbHeight(e?.endCoordinates?.height ?? 0));
    const hideSub = Keyboard.addListener(hideEvent, () => setKbHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const markersToShow: Pharmacy[] = selected ? [selected] : filtered;

  const animateTo = useCallback((f: Pharmacy) => {
    if (lastCenteredId.current === f.id) return;
    lastCenteredId.current = f.id;
    mapRef.current?.animateToRegion({ latitude: f.lat, longitude: f.lng, latitudeDelta: 0.006, longitudeDelta: 0.006 }, 380);
  }, []);

  const handleSelectFromList = useCallback(
    (f: Pharmacy, index: number) => {
      setSelected(f);
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.02 });
      requestAnimationFrame(() => animateTo(f));
    },
    [animateTo]
  );

  const handleMarkerPress = useCallback(
    (f: Pharmacy) => {
      setSelected(f);
      animateTo(f);
      const idx = idToIndex.get(f.id);
      if (idx !== undefined) {
        ensureExpanded().then(() => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.02 });
          }, 120);
        });
      }
    },
    [animateTo, idToIndex, ensureExpanded]
  );

  const call = (phone?: string | null) => {
    if (!phone) return;
    const normalized = phone.replace(/[^\d+]/g, "");
    Linking.openURL(`tel:${normalized}`).catch(() => {});
  };
  const navigateTo = (f: Pharmacy) => {
    const label = encodeURIComponent(f.name);
    const url = Platform.OS === "ios" ? `http://maps.apple.com/?q=${label}&ll=${f.lat},${f.lng}` : `geo:${f.lat},${f.lng}?q=${f.lat},${f.lng}(${label})`;
    Linking.openURL(url).catch(() => {});
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Pharmacy; index: number }) => {
      const active = selected?.id === item.id;
      return (
        <FarmaciaItem
          item={item}
          active={!!active}
          onPress={() => handleSelectFromList(item, index)}
          onCall={() => call(item.phone)}
          onNavigate={() => navigateTo(item)}
          onBack={() => {
            setSelected(null);
            lastCenteredId.current = null;
          }}
        />
      );
    },
    [selected?.id, handleSelectFromList]
  );

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} showsCompass={false} toolbarEnabled={false} loadingEnabled>
        {markersToShow.map((f) => (
          <MarkerFarmacia key={f.id} item={f} selected={!!(selected && selected.id === f.id)} onPress={handleMarkerPress} />
        ))}
      </MapView>

      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Farmacias de Federal</Text>
      </View>

      <Animated.View style={[styles.bottomSheet, { height: Animated.add(sheetHeight, new Animated.Value(kbHeight > 0 ? kbHeight : 0)) }]}>
        <DragHandle panHandlers={pan.panHandlers} />
        <FiltersChips value={filter} onChange={(v) => { setFilter(v); setSelected(null); lastCenteredId.current = null; }} data={FILTERS} />
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
              const approx = info.averageItemLength ? info.averageItemLength * info.index : 120 * info.index;
              listRef.current?.scrollToOffset({ offset: approx, animated: true });
              setTimeout(() => {
                listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.02 });
              }, 120);
            }}
            ListEmptyComponent={<EmptyList loading={loading} message="No se encontraron farmacias" />}
          />
        </View>
      </Animated.View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

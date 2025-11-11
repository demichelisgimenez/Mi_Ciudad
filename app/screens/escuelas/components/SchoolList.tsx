import React, { useCallback, useRef } from "react";
import { FlatList } from "react-native";
import { escuelaStyles as styles } from "@utils/styles/escuelas";
import type { School } from "../types";
import { SchoolCard } from "./SchoolCard";

export function SchoolList({
  data,
  selectedId,
  loading,
  onSelect,
  onCall,
  onNavigate,
  onClearSelection,
  listRef,
}: {
  data: School[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (s: School, index: number) => void;
  onCall: (s: School) => void;
  onNavigate: (s: School) => void;
  onClearSelection: () => void;
  listRef: React.RefObject<FlatList<School>>;
}) {
  const renderItem = useCallback(
    ({ item, index }: { item: School; index: number }) => {
      const active = selectedId === item.id;
      return (
        <SchoolCard
          item={item}
          active={!!active}
          onPress={() => onSelect(item, index)}
          onCall={() => onCall(item)}
          onNavigate={() => onNavigate(item)}
          onBack={onClearSelection}
        />
      );
    },
    [selectedId, onSelect, onCall, onNavigate, onClearSelection]
  );

  return (
    <FlatList
      ref={listRef}
      data={data}
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
    />
  );
}

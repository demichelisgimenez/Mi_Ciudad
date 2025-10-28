import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radiosStyles as styles } from "@utils/styles/radios";
import { useRadio } from "@shared/context/RadioContext";
import { FEDERAL_RADAR } from "@utils/data/federal-radar";

type PlayableCard = {
  key: string;
  title: string;
  desc?: string;
  image: string;
  streamUrl: string;
  freq?: string | number;
};

const isHttp = (u?: string) => !!u && /^https?:\/\//i.test(u.trim());
const isPlaylist = (u: string) => /\.(m3u8?|pls)(\?.*)?$/i.test(u);

async function resolveStreamUrl(url: string): Promise<string | null> {
  const clean = url.trim();
  if (!isHttp(clean)) return null;

  if (!isPlaylist(clean)) return clean;

  try {
    const res = await fetch(clean, { method: "GET" });
    const text = await res.text();

    if (/\.m3u8?(\?.*)?$/i.test(clean)) {
      const lines = text.split(/\r?\n/).map(l => l.trim());
      const firstUrl = lines.find(l => /^https?:\/\//i.test(l));
      return firstUrl ?? clean;
    }

    if (/\.pls(\?.*)?$/i.test(clean)) {
      const match = text.match(/^\s*File\d+\s*=\s*(https?:\/\/[^\s]+)\s*$/im);
      if (match?.[1]) return match[1].trim();
    }

    return clean;
  } catch {
    return clean;
  }
}

export default function RadiosScreen() {
  const { isPlaying, current, toggle, setStation, next, prev, setPlaylist } = useRadio();

  const [streamsByKey, setStreamsByKey] = useState<Record<string, string>>({});
  const [playable, setPlayable] = useState<PlayableCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const cards = useMemo(
    () => [...FEDERAL_RADAR].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const loadFromJson = useCallback(async () => {
    const map: Record<string, string> = {};
    const playableOut: PlayableCard[] = [];

    for (const item of cards) {
      const raw = item.streamUrl ?? "";
      if (!isHttp(raw)) continue;

      const resolved = await resolveStreamUrl(raw);
      if (!resolved) continue;

      map[item.key] = resolved;
      playableOut.push({
        key: item.key,
        title: item.title,
        desc: item.desc,
        image: item.image,
        streamUrl: resolved,
        freq: (item as any).freq,
      });
    }

    setStreamsByKey(map);
    setPlayable(playableOut);

    setPlaylist(playableOut.map(p => ({ name: p.title, url: p.streamUrl })));
  }, [cards, setPlaylist]);

  useEffect(() => {
    loadFromJson().catch(() => {});
  }, [loadFromJson]);

  const onRefresh = useCallback(() => {
    (async () => {
      setRefreshing(true);
      try {
        await loadFromJson();
      } finally {
        setRefreshing(false);
      }
    })();
  }, [loadFromJson]);

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.key}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <>
          <View style={[styles.header, { marginTop: 8 }]}>
            <Text style={styles.title}>
              <Ionicons name="radio-outline" size={26} color="rgba(25,26,105,0.9)" />{" "}
              Radio FM
            </Text>
            <Text style={styles.subtitle}>Federal, Entre Ríos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.frequency}>{(current as any)?.freq ?? "--"}</Text>
            <Text style={styles.stationName}>
              {current?.name ?? "Seleccione una emisora"}
            </Text>
            <View style={styles.status}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                {isPlaying ? "Reproduciendo" : "Detenido"}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={prev}
              disabled={!playable.length}
            >
              <Ionicons name="play-skip-back" size={28} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, styles.playBtn]}
              onPress={toggle}
              disabled={!playable.length}
            >
              {isPlaying ? (
                <Ionicons name="pause" size={32} color="white" />
              ) : (
                <Ionicons name="play" size={32} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={next}
              disabled={!playable.length}
            >
              <Ionicons name="play-skip-forward" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <View style={[styles.presets, { paddingBottom: 10 }]}>
            <Text style={styles.presetsLabel}>Radios disponibles</Text>
          </View>
        </>
      }
      renderItem={({ item }) => {
        const url = streamsByKey[item.key];
        const active =
          current?.name ? current.name === item.title : false;

        return (
          <TouchableOpacity
            style={[
              styles.presetBtn,
              active && styles.presetBtnActive,
              !url && { opacity: 0.6 },
            ]}
            disabled={!url}
            onPress={() => {
              if (!url) return;
              setStation({ name: item.title, url, freq: (item as any)?.freq });
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 56, height: 56, borderRadius: 12, marginBottom: 8 }}
            />
            <Text
              style={[
                styles.presetText,
                active && styles.presetTextActive,
                { textAlign: "center" },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {!!item.desc && (
              <Text
                style={[
                  styles.presetName,
                  active && styles.presetNameActive,
                  { textAlign: "center" },
                ]}
                numberOfLines={2}
              >
                {item.desc}
              </Text>
            )}
            {!url && (
              <Text
                style={[styles.presetName, { textAlign: "center", marginTop: 4 }]}
                numberOfLines={1}
              >
                (sin stream)
              </Text>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
}

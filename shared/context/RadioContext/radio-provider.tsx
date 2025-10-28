import React, { useRef, useState, useEffect, useCallback } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { RadioContext, type RadioStation, type PlayerPos } from "./radio-context";

export default function RadioProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [current, setCurrent] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerPos, setPlayerPos] = useState<PlayerPos>(null);

  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true }).catch(() => {});
    playerRef.current = createAudioPlayer(null);
    return () => {
      try { playerRef.current?.remove(); } catch {}
      playerRef.current = null;
    };
  }, []);

  const unload = useCallback(async () => {
    try {
      playerRef.current?.pause?.();
    } finally {
      setIsPlaying(false);
    }
  }, []);

  const loadAndPlay = useCallback(
    async (station: RadioStation) => {
      if (!playerRef.current) return;
      setLoading(true);
      setError(undefined);
      try {
        await unload();
        playerRef.current.replace({ uri: station.url });
        playerRef.current.play();
        setCurrent(station);
        setIsPlaying(true);
        setPlayerVisible(true);
      } catch (e: any) {
        setError(typeof e?.message === "string" ? e.message : "No se pudo reproducir esta emisora.");
        setIsPlaying(false);
      } finally {
        setLoading(false);
      }
    },
    [unload]
  );

  const play = useCallback(
    async (s?: RadioStation) => {
      if (s) return loadAndPlay(s);
      if (!playerRef.current || !current) return;
      playerRef.current.play();
      setIsPlaying(true);
      setPlayerVisible(true);
    },
    [current, loadAndPlay]
  );

  const pause = useCallback(async () => {
    if (!playerRef.current) return;
    playerRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (!playerRef.current) return;
    if (isPlaying) return pause();
    return play();
  }, [isPlaying, play, pause]);

  const dismissPlayer = useCallback(() => {
    pause();
    setPlayerVisible(false);
  }, [pause]);

  const setStation = useCallback(async (s: RadioStation) => loadAndPlay(s), [loadAndPlay]);

  const next = useCallback(async () => {
    if (!current || stations.length === 0) return;
    const i = stations.findIndex(x => x.url === current.url);
    const n = stations[(i + 1) % stations.length];
    await loadAndPlay(n);
  }, [current, stations, loadAndPlay]);

  const prev = useCallback(async () => {
    if (!current || stations.length === 0) return;
    const i = stations.findIndex(x => x.url === current.url);
    const p = stations[(i - 1 + stations.length) % stations.length];
    await loadAndPlay(p);
  }, [current, stations, loadAndPlay]);

  const setPlaylist = useCallback((list: RadioStation[]) => setStations(list), []);

  return (
    <RadioContext.Provider
      value={{
        stations,
        current,
        isPlaying,
        loading,
        error,
        playerVisible,
        playerPos,
        setPlayerPos,
        play,
        pause,
        toggle,
        setStation,
        next,
        prev,
        reload: () => {},
        setPlaylist,
        dismissPlayer,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

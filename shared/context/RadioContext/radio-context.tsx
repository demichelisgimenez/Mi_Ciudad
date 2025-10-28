import React, { createContext, useContext } from "react";

export type RadioStation = { name: string; url: string; freq?: string | number };

export type PlayerPos = { x: number; y: number } | null;

export type RadioCtx = {
  stations: RadioStation[];
  current: RadioStation | null;
  isPlaying: boolean;
  loading: boolean;
  error?: string;
  playerVisible: boolean;
  playerPos: PlayerPos;
  setPlayerPos: (p: PlayerPos) => void;

  play: (s?: RadioStation) => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
  setStation: (s: RadioStation) => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  reload: () => void;
  setPlaylist: (list: RadioStation[]) => void;
  dismissPlayer: () => void;
};

export const RadioContext = createContext<RadioCtx | undefined>(undefined);

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within <RadioProvider>");
  return ctx;
}

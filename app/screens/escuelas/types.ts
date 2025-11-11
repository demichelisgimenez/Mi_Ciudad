export type Level =
  | "Inicial"
  | "Primaria"
  | "Secundaria"
  | "Técnica"
  | "Superior"
  | "Especial"
  | "Adultos";

export type School = {
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

export const LEVELS: (Level | "Todos")[] = [
  "Todos",
  "Inicial",
  "Primaria",
  "Secundaria",
  "Técnica",
  "Superior",
  "Especial",
  "Adultos",
];

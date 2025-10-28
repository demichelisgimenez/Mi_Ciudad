// @utils/constants.ts
import type { RadioBrowserStation } from "@utils/radio-browser";
export const ROOT_ROUTES = {
  AUTH: "Auth",
  SCREENS: "Screens",
} as const;


export const AUTH_ROUTES = {
  LOGIN: "Login",
  REGISTER: "Register",
} as const;

export const DRAWER_ROUTES = {
  INICIO: 'Inicio',
  ESCUELAS: 'Escuelas',
  FARMACIAS: 'Farmacias',
  RADIOS: 'Radios',
  QR:'QR',
  LOGIN:'Login',
  NOTAS:'Notas',
  AJUSTES: 'Ajustes',
}


export type RadioStation = {
  name: string;
  url: string;
  freq?: number;
  favicon?: string;
};

export function mapRBtoStations(items: RadioBrowserStation[]): RadioStation[] {
  return items.map((s) => ({
    name: s.name?.trim() || "Emisora",
    url: s.url,
    favicon: s.favicon,
  }));
}
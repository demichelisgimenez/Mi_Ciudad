export type TimeRange = { from: string; to: string };
export type Hours = { weekday?: TimeRange[]; saturday?: TimeRange[] };

export type Filter = "Todas" | "Abierto ahora";

export type Pharmacy = {
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
export function isOpenAt(hours: Hours | null | undefined, date = new Date()): boolean {
  if (!hours) return false;
  const day = date.getDay();
  const todayRanges: TimeRange[] = day === 6 ? hours.saturday ?? [] : day === 0 ? [] : hours.weekday ?? [];
  if (!todayRanges.length) return false;
  const n = nowLocalMinutes();
  return todayRanges.some(({ from, to }) => {
    const nFrom = minutes(parseHM(from));
    const nTo = minutes(parseHM(to));
    return n >= nFrom && n <= nTo;
  });
}
export function todayLabel(hours?: Hours | null): string {
  if (!hours) return "Sin horarios";
  const day = new Date().getDay();
  const arr: TimeRange[] = day === 6 ? hours.saturday ?? [] : day === 0 ? [] : hours.weekday ?? [];
  if (!arr.length) return day === 0 ? "Domingo: cerrado" : "Hoy: cerrado";
  const slots = arr.map((r) => `${r.from}–${r.to}`).join(" · ");
  return `Hoy: ${slots}`;
}

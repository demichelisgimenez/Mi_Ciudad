const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export type WeatherNow = {
  tempC: number | null;
  feelsLikeC: number | null;
  description: string;
  main: string;
  isDay: boolean;
  updatedAt: string;
  humidity: number | null;
  windKmh: number | null;
};

function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function fetchFederalWeather(): Promise<WeatherNow> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OPENWEATHER_API_KEY_MISSING");
  }

  const lat = -30.9546;
  const lon = -58.7833;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }

  const json = await res.json();

  const mainBlock = json?.main || {};
  const weather0 = Array.isArray(json?.weather) && json.weather.length > 0 ? json.weather[0] : null;
  const wind = json?.wind || {};

  const tempC = mainBlock.temp != null ? Math.round(Number(mainBlock.temp)) : null;
  const feelsLikeC = mainBlock.feels_like != null ? Math.round(Number(mainBlock.feels_like)) : null;
  const humidity = mainBlock.humidity != null ? Math.round(Number(mainBlock.humidity)) : null;
  const windKmh = wind.speed != null ? Math.round(Number(wind.speed) * 3.6) : null;

  const description = weather0?.description ? capitalize(String(weather0.description)) : "Sin datos";
  const main = weather0?.main ? String(weather0.main) : "";

  const dt = json?.dt != null ? Number(json.dt) * 1000 : Date.now();
  const updatedAt = new Date(dt).toISOString();

  const iconCode = weather0?.icon ? String(weather0.icon) : "01d";
  const isDay = iconCode.endsWith("d");

  return {
    tempC,
    feelsLikeC,
    description,
    main,
    isDay,
    updatedAt,
    humidity,
    windKmh,
  };
}

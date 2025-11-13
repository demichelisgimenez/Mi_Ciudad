export function weatherIconFromOW(main: string, isDay: boolean): string {
  const t = (main || "").toLowerCase();
  if (t === "thunderstorm") return "weather-lightning-rainy";
  if (t === "drizzle") return "weather-rainy";
  if (t === "rain") return "weather-rainy";
  if (t === "snow") return "weather-snowy";
  if (t === "mist" || t === "smoke" || t === "haze" || t === "fog") return "weather-fog";
  if (t === "dust" || t === "sand" || t === "ash") return "weather-windy";
  if (t === "squall" || t === "tornado") return "weather-windy";
  if (t === "clouds") return "weather-cloudy";
  if (t === "clear") return isDay ? "weather-sunny" : "weather-night";
  return "weather-cloudy";
}

export type WeatherVisual = {
  gradient: [string, string];
  icon: string;
};

export function getWeatherVisual(main: string, isDay: boolean): WeatherVisual {
  const t = (main || "").toLowerCase();

  if (t === "clear") {
    return {
      gradient: isDay
        ? ["#FF9A3C", "#FF5F6D"]
        : ["#3A1C71", "#D76D77"],
      icon: isDay ? "weather-sunny" : "weather-night",
    };
  }

  if (t === "clouds") {
    return {
      gradient: ["#4F7CFF", "#83A4FF"],
      icon: "weather-cloudy",
    };
  }

  if (t === "rain" || t === "drizzle") {
    return {
      gradient: ["#355C7D", "#6C5B7B"],
      icon: "weather-rainy",
    };
  }

  if (t === "thunderstorm") {
    return {
      gradient: ["#232526", "#414345"],
      icon: "weather-lightning-rainy",
    };
  }

  if (t === "snow") {
    return {
      gradient: ["#74EBD5", "#ACB6E5"],
      icon: "weather-snowy",
    };
  }

  if (t === "mist" || t === "fog" || t === "haze" || t === "smoke") {
    return {
      gradient: ["#757F9A", "#D7DDE8"],
      icon: "weather-fog",
    };
  }

  return {
    gradient: ["#4F7CFF", "#83A4FF"],
    icon: "weather-cloudy",
  };
}

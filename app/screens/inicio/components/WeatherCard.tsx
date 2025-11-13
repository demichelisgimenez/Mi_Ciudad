import React, { useMemo } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { inicioStyles as styles } from "@utils/styles/inicio";
import { useWeather } from "@utils/hooks/useWeather";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getWeatherVisual } from "@utils/mappers/weatherVisual";

function hhmm(s: string) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function WeatherCard() {
  const { data, loading, error, expanded, toggle, refresh } = useWeather();

  const description = loading
    ? "Cargando..."
    : error
    ? "No disponible"
    : data?.description ?? "Sin datos";

  const details = useMemo(() => {
    if (!data) return null;
    return [
      data.feelsLikeC != null ? `Sensación ${data.feelsLikeC}°C` : null,
      data.humidity != null ? `Humedad ${data.humidity}%` : null,
      data.windKmh != null ? `Viento ${data.windKmh} km/h` : null,
      data.updatedAt ? `Actualizado ${hhmm(data.updatedAt)} hs` : null,
    ].filter(Boolean);
  }, [data]);

  const tempText = loading || !data?.tempC ? "—" : `${data.tempC}°C`;

  const visual = getWeatherVisual(data?.main || "", !!data?.isDay);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={toggle}
      onLongPress={refresh}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      <LinearGradient
        colors={visual.gradient}
        style={styles.weatherCard}
      >
        <View style={styles.weatherLeftModern}>
          <MaterialCommunityIcons
            name={visual.icon as any}
            size={42}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <View style={styles.weatherTextCol}>
            <Text style={styles.weatherTitleModern} numberOfLines={1}>
              Clima en Federal
            </Text>
            <Text style={styles.weatherSubtitleModern} numberOfLines={1}>
              {description}
            </Text>
          </View>
        </View>

        <Text style={styles.weatherTempModern}>
          {tempText}
        </Text>
      </LinearGradient>

      {expanded && details && details.length > 0 && (
        <View style={styles.weatherExpandedBox}>
          {details.map((d, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{d}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

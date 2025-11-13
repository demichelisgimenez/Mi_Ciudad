import { useCallback, useEffect, useState } from "react";
import { fetchFederalWeather, type WeatherNow } from "@utils/services/weather";

export function useWeather() {
  const [data, setData] = useState<WeatherNow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const w = await fetchFederalWeather();
      setData(w);
    } catch (e) {
      console.error("Weather error", e);
      setError("No disponible");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  return { data, loading, error, refresh: load, expanded, toggle };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Keyboard } from "react-native";
import { supabase } from "@utils/supabase";
import type { Level, School } from "../types";

export function useSchools() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [level, setLevel] = useState<Level | "Todos">("Todos");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [kbHeight, setKbHeight] = useState(0);

  // debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 200);
    return () => clearTimeout(t);
  }, [queryInput]);

  // teclado
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e: any) =>
      setKbHeight(e?.endCoordinates?.height ?? 0)
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKbHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("schools")
          .select(
            "id,name,address,city,province,department,cue,phone,email,level,lat,lng"
          )
          .eq("department", "Federal")
          .order("name", { ascending: true });
        if (error) throw error;
        if (alive) setSchools((data ?? []) as School[]);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar escuelas");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // filtrado
  const filtered = useMemo(() => {
    const base = level === "Todos" ? schools : schools.filter((s) => s.level === level);
    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.address ?? "").toLowerCase().includes(q) ||
        (s.city ?? "").toLowerCase().includes(q) ||
        (s.cue ?? "").toLowerCase().includes(q)
    );
  }, [schools, level, query]);

  // índice por id para scroll
  const idToIndex = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((s, i) => m.set(s.id, i));
    return m;
  }, [filtered]);

  return {
    loading,
    error,
    schools,
    filtered,
    idToIndex,
    level,
    setLevel,
    queryInput,
    setQueryInput,
    kbHeight,
  };
}

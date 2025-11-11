import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@utils/supabase";
import { isOpenAt } from "../types";
import type { Pharmacy, Hours, Filter } from "../types";

export function usePharmacies(filter: Filter, query: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Pharmacy[]>([]);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pharmacies")
          .select("id,name,address,phone,hours,lat,lng,city,province,department")
          .eq("department", "Federal")
          .order("name", { ascending: true });
        if (error) throw error;
        if (aliveRef.current) setItems((data ?? []) as Pharmacy[]);
      } catch (e: any) {
        if (aliveRef.current) setError(e?.message ?? "Error al cargar farmacias");
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    })();
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        (it.address ?? "").toLowerCase().includes(q) ||
        (it.phone ?? "").toLowerCase().includes(q)
      );
    });
    if (filter === "Abierto ahora") return base.filter((f) => isOpenAt(f.hours as Hours));
    return base;
  }, [items, filter, query]);

  const idToIndex = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((f, i) => m.set(f.id, i));
    return m;
  }, [filtered]);

  return { loading, error, filtered, idToIndex };
}

import { supabase } from "@utils/supabase";

export const fetchEscuelas = async () => {
  const { data, error } = await supabase
    .from("schools")
    .select("id,name,address,city,phone,email,level,lat,lng")
    .eq("department", "Federal")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error al cargar escuelas:", error);
    return [];
  }

  return data || [];
};

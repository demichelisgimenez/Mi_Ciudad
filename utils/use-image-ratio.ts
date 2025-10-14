import { useEffect, useState } from "react";
import { Image } from "react-native";

export function useImageRatio(uri?: string | null, fallback: number = 16 / 9) {
  const [ratio, setRatio] = useState<number>(fallback);

  useEffect(() => {
    if (!uri) return;
    let mounted = true;
    Image.getSize(
      uri,
      (w, h) => mounted && h > 0 && setRatio(w / h),
      () => mounted && setRatio(fallback)
    );
    return () => {
      mounted = false;
    };
  }, [uri, fallback]);

  return ratio;
}

import { useMemo, useRef } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

export function useBottomSheet() {
  const { height: SCREEN_H } = Dimensions.get("window");
  const SNAP_MIN = 44;
  const SNAP_MID = Math.max(Math.round(SCREEN_H * 0.42), 320);
  const SNAP_MAX = Math.max(Math.round(SCREEN_H * 0.86), 480);

  const sheetHeight = useRef(new Animated.Value(SNAP_MID)).current;
  const heightValue = useRef(SNAP_MID);
  sheetHeight.addListener(({ value }) => (heightValue.current = value));

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
        onPanResponderMove: (_, g) => {
          const next = clamp(heightValue.current - g.dy, SNAP_MIN, SNAP_MAX);
          sheetHeight.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const current = heightValue.current;
          const snaps = [SNAP_MIN, SNAP_MID, SNAP_MAX];
          const biased = current + (g.vy > 0.5 ? -60 : g.vy < -0.5 ? 60 : 0);
          const nearest = snaps.reduce((a, b) => (Math.abs(b - biased) < Math.abs(a - biased) ? b : a));
          Animated.spring(sheetHeight, { toValue: nearest, useNativeDriver: false, tension: 180, friction: 22 }).start();
        },
      }),
    [sheetHeight]
  );

  const ensureExpanded = () =>
    new Promise<void>((res) => {
      if (heightValue.current >= SNAP_MID) return res();
      Animated.spring(sheetHeight, { toValue: SNAP_MID, useNativeDriver: false }).start(() => res());
    });

  return { sheetHeight, pan, ensureExpanded };
}

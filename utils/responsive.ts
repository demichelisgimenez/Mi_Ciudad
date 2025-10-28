import { useWindowDimensions, Platform, PixelRatio } from "react-native";

export type DeviceCategory = "phone-compact" | "phone" | "tablet" | "desktoplike";

export function getDeviceCategory(w: number, h: number): DeviceCategory {
  const minDim = Math.min(w, h);
  if (minDim >= 900) return "desktoplike";
  if (minDim >= 768) return "tablet";
  if (minDim <= 360) return "phone-compact";
  return "phone";
}

const guidelineBaseWidth = 375;
function scaleByWidth(size: number, width: number) {
  return Math.round((width / guidelineBaseWidth) * size);
}

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const category = getDeviceCategory(width, height);
  const isLandscape = width > height;
  const isTablet = category === "tablet" || (Platform.OS === "ios" && (Platform as any).isPad);
  const isPhoneCompact = category === "phone-compact";

  const screenPadding = isTablet ? 12 : 8;
  const contentMaxWidth = isTablet || width >= 900 ? Math.min(720, Math.floor(width * 0.92)) : Math.floor(width);
  const titleSize = isTablet ? 26 : isPhoneCompact ? 20 : 22;
  const touch = PixelRatio.get() > 2 ? 44 : 40;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    isPhoneCompact,
    category,
    screenPadding,
    contentMaxWidth,
    titleSize,
    touch,
    scale: (n: number) => scaleByWidth(n, width),
  };
}

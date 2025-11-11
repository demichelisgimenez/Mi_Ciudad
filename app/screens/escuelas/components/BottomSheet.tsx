import React from "react";
import { Animated, View } from "react-native";
import { escuelaStyles as styles } from "@utils/styles/escuelas";

export function BottomSheet({
  heightAnimated,
  kbHeight,
  panHandlers,
  children,
}: {
  heightAnimated: Animated.Value;
  kbHeight: number;
  panHandlers: any;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: Animated.add(
            heightAnimated,
            new Animated.Value(kbHeight > 0 ? kbHeight : 0)
          ),
        },
      ]}
    >
      {/* Overlay invisible amplia para agarrar gesto cómodamente */}
      <View {...panHandlers} style={styles.gestureOverlay} pointerEvents="box-only" />
      {/* Handle visible */}
      <View {...panHandlers} style={styles.dragStrip} hitSlop={{ top: 10, bottom: 20 }}>
        <View style={styles.handleBar} />
      </View>

      {children}
    </Animated.View>
  );
}

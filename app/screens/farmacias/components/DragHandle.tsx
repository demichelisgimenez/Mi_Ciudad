import React from "react";
import { View } from "react-native";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";

export default function DragHandle({ panHandlers }: { panHandlers: any }) {
  return (
    <>
      <View {...panHandlers} style={styles.dragHitbox} pointerEvents="box-only" />
      <View {...panHandlers} style={styles.dragStrip} hitSlop={{ top: 10, bottom: 20 }}>
        <View style={styles.handleBar} />
      </View>
    </>
  );
}


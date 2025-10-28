import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, PanResponder, LayoutChangeEvent, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRadio } from "@shared/context/RadioContext/radio-context";
import { radiosStyles as styles } from "@utils/styles/radios";

export default function RadioMiniPlayer() {
  const { playerVisible, current, isPlaying, toggle, dismissPlayer, next, prev, playerPos, setPlayerPos } = useRadio();
  const insets = useSafeAreaInsets();
  const [box, setBox] = useState({ w: 0, h: 0 });
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const { width: screenW, height: screenH } = Dimensions.get("window");

  const defaultPos = useMemo(() => {
    const pad = 12;
    const y = screenH - (insets.bottom || 0) - pad - (box.h || 72);
    const x = (screenW - (box.w || 320)) / 2;
    return { x: Math.max(0, x), y: Math.max(0, y) };
  }, [screenW, screenH, insets.bottom, box.w, box.h]);

  useEffect(() => {
    if (!playerVisible || !current) return;
    const initial = playerPos ?? defaultPos;
    translate.setValue(initial);
  }, [playerVisible]); // no depende de current para evitar parpadeo

  const clampToBounds = (x: number, y: number) => {
    const pad = 6;
    const minX = pad + (insets.left || 0);
    const minY = pad + (insets.top || 0);
    const maxX = screenW - (box.w || 0) - (insets.right || 0) - pad;
    const maxY = screenH - (box.h || 0) - (insets.bottom || 0) - pad;
    return {
      x: Math.min(Math.max(x, minX), Math.max(minX, maxX)),
      y: Math.min(Math.max(y, minY), Math.max(minY, maxY)),
    };
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translate.stopAnimation();
        // @ts-ignore
        translate.setOffset({ x: translate.x._value, y: translate.y._value });
        translate.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: translate.x, dy: translate.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        translate.flattenOffset();
        // @ts-ignore
        const currX: number = translate.x._value;
        // @ts-ignore
        const currY: number = translate.y._value;
        const clamped = clampToBounds(currX, currY);
        Animated.spring(translate, { toValue: clamped, useNativeDriver: false, bounciness: 6 }).start();
        setPlayerPos(clamped);
      },
      onPanResponderTerminate: () => {
        translate.flattenOffset();
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.w || height !== box.h) setBox({ w: width, h: height });
  };

  if (!playerVisible || !current) return null;

  return (
    <View style={styles.miniOverlay} pointerEvents="box-none">
      <Animated.View
        {...pan.panHandlers}
        onLayout={onLayout}
        style={[
          styles.miniDraggable,
          styles.miniPlayer,
          { transform: [{ translateX: translate.x }, { translateY: translate.y }] },
        ]}
      >
        <View style={{ flex: 1, paddingRight: 6 }}>
          <Text style={styles.miniPlayerTitle} numberOfLines={1}>{current.name}</Text>
          <Text style={styles.miniPlayerSubtitle} numberOfLines={1}>{isPlaying ? "Reproduciendo" : "Pausado"}</Text>
        </View>

        <TouchableOpacity onPress={prev} style={styles.miniIconBtn}>
          <Ionicons name="play-skip-back" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggle} style={[styles.miniPlayBtn, isPlaying && styles.miniPlayBtnActive]}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={next} style={styles.miniIconBtn}>
          <Ionicons name="play-skip-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={dismissPlayer} style={styles.miniCloseBtn}>
          <Ionicons name="close" size={18} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

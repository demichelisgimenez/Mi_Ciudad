import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { materialColors } from "../../utils/colors";
import { sizes } from "@utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface Props {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  icon,
  variant = "primary",
  fullWidth,
  style,
  textStyle,
}: Props) {
  const scheme = materialColors.schemes.dark;

  const palette = {
    primary: {
      bg: scheme.primary,
      border: scheme.primary,
      text: scheme.onPrimary,
    },
    secondary: {
      bg: scheme.secondary,
      border: scheme.secondary,
      text: scheme.onSecondary,
    },
    danger: {
      bg: scheme.error,
      border: scheme.error,
      text: scheme.onError,
    },
    outline: {
      bg: "transparent",
      border: scheme.outline,
      text: scheme.primary,
    },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[fullWidth && { flex: 1 }]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={palette.text} size="small" />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={palette.text}
                style={styles.icon}
              />
            )}
            <Text style={[styles.text, { color: palette.text }, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: sizes?.sm ?? 10,
    paddingHorizontal: sizes?.base ?? 14,
  },
  text: {
    fontWeight: "600",
    fontSize: 15,
  },
  icon: {
    marginRight: 6,
  },
});

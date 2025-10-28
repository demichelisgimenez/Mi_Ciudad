import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@utils";
import { useResponsive } from "@utils/responsive";

type Props = {
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
  centerContent?: boolean;
};

export default function Screen({ children, edges = ["left", "right", "bottom"], centerContent = true }: Props) {
  const r = useResponsive();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>
      <View style={{ flex: 1, paddingHorizontal: r.screenPadding, paddingTop: 0, paddingBottom: 0 }}>
        <View style={{ flex: 1, width: centerContent ? r.contentMaxWidth : "100%", alignSelf: centerContent ? "center" : "auto" }}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

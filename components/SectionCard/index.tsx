import React from "react";
import { View, ViewProps } from "react-native";
import { cards } from "@utils/styles/cards";

export default function SectionCard({ style, ...rest }: ViewProps) {
  return <View style={[cards.card, style]} {...rest} />;
}

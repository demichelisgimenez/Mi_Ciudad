import React from "react";
import { TextInput } from "react-native";
import { escuelaStyles as styles } from "@utils/styles/escuelas";

export function SearchInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) {
  return (
    <TextInput
      placeholder={placeholder ?? "Buscar por nombre, dirección o CUE…"}
      placeholderTextColor="#8A8A8A"
      value={value}
      onChangeText={onChangeText}
      style={styles.searchInput}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
      blurOnSubmit
    />
  );
}

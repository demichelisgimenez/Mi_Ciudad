import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { forms } from "@utils/styles/forms";

type Props = TextInputProps & {
  row?: boolean;
  style?: any;
};

export default function Input({ row, style, ...props }: Props) {
  if (row) {
    return (
      <View style={[forms.inputRow, style]}>
        <TextInput style={{ flex: 1 }} {...props} />
      </View>
    );
  }
  return <TextInput style={[forms.input, style]} {...props} />;
}

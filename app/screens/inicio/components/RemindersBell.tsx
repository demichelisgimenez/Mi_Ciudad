import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@utils";

type Props = {
  userId: string | null;
  pendingCount: number;
  onToggle: () => void;
};

export default function RemindersBell({ userId, pendingCount, onToggle }: Props) {
  if (!userId) return null;

  return (
    <TouchableOpacity
      style={{
        padding: 8,
        borderRadius: 999,
        backgroundColor: colors.surface || "#ffffff",
        borderWidth: 1,
        borderColor: colors.primary || "#1e3a8a",
        position: "relative",
      }}
      onPress={onToggle}
    >
      <MaterialIcons
        name={pendingCount > 0 ? "notifications-active" : "notifications-none"}
        size={22}
        color={colors.primary || "#1e3a8a"}
      />
      {pendingCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "red",
            width: 20,
            height: 20,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>{pendingCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

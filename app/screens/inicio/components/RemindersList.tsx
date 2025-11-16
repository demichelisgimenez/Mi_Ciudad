import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@utils";
import { ReminderItem } from "../types";
import { formatRange, getStatus } from "../hooks/use-reminders";

type Props = {
  visible: boolean;
  userId: string | null;
  loading: boolean;
  reminders: ReminderItem[];
  onDelete: (item: ReminderItem) => void;
  onClearAll: () => void;
  onPressReminder: () => void;
};

export default function RemindersList({
  visible,
  userId,
  loading,
  reminders,
  onDelete,
  onClearAll,
  onPressReminder,
}: Props) {
  if (!visible || !userId) return null;

  return (
    <View
      style={{
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.surface || "#fff",
        borderWidth: 1,
        borderColor: colors.primary || "#1e3a8a",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.primary || "#1e3a8a",
          }}
        >
          Recordatorios
        </Text>

        {reminders.length > 0 && !loading && (
          <TouchableOpacity
            onPress={onClearAll}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: "#ffe4e4",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "red",
              }}
            >
              Borrar todo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginVertical: 8 }} />
      ) : reminders.length === 0 ? (
        <Text style={{ opacity: 0.6 }}>No hay recordatorios.</Text>
      ) : (
        reminders.map((r) => {
          const status = getStatus(r);
          const statusText =
            status === "activo"
              ? "Activo"
              : status === "programado"
              ? "Programado"
              : "Expirado";
          const statusColor =
            status === "activo"
              ? colors.primary || "#1e3a8a"
              : status === "programado"
              ? colors.textSecondary
              : "red";

          return (
            <View
              key={r.id}
              style={{
                paddingVertical: 8,
                borderBottomWidth: 0.5,
                borderBottomColor: "#eee",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={onPressReminder}
                  style={{ flex: 1, paddingRight: 8 }}
                >
                  <Text style={{ fontWeight: "600" }} numberOfLines={1}>
                    {r.title || "Nota sin título"}
                  </Text>
                  <Text style={{ opacity: 0.7 }} numberOfLines={2}>
                    {formatRange(r.reminder_start, r.reminder_end)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                      color: statusColor,
                    }}
                  >
                    {statusText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDelete(r)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#ffdddd",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="close" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

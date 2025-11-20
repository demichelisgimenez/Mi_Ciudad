import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { inicioStyles as styles } from "@utils/styles/inicio";
import { USEFUL_PHONE_CATEGORIES } from "@utils/data/usefulPhones";

function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function getCategoryCircleStyle(id: string) {
  if (id === "emergencias") return styles.categoryIconEmergencias;
  if (id === "salud") return styles.categoryIconSalud;
  if (id === "seguridad") return styles.categoryIconSeguridad;
  if (id === "municipio-servicios") return styles.categoryIconMunicipio;
  if (id === "transporte") return styles.categoryIconTransporte;
  if (id === "tramites") return styles.categoryIconTramites;
  return styles.categoryIconDefault;
}

export default function UsefulPhonesSection() {
  const handleCall = useCallback((rawPhone: string) => {
    const phone = sanitizePhone(rawPhone);
    if (!phone) return;

    const url = `tel:${phone}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "No se pudo abrir el marcador",
        "Probá en un teléfono físico: algunos emuladores no tienen app de teléfono."
      );
    });
  }, []);

  return (
    <View style={styles.usefulPhonesCard}>
      <View style={styles.phonesHeaderRow}>
        <View style={styles.phonesHeaderLeft}>
          <View style={styles.phonesHeroIconCircle}>
            <MaterialIcons
              name="phone-in-talk"
              size={22}
              style={styles.phonesHeroIcon}
            />
          </View>
          <View>
            <Text style={styles.phonesTitle}>Teléfonos útiles</Text>
            <Text style={styles.phonesSubtitle}>
              Accedé rápido a los números más importantes
            </Text>
          </View>
        </View>
      </View>

      <View>
        {USEFUL_PHONE_CATEGORIES.map((category) => (
          <View key={category.id} style={styles.usefulPhonesCategoryBlock}>
            <View style={styles.usefulPhonesCategoryHeader}>
              <View
                style={[
                  styles.usefulPhonesCategoryIconCircle,
                  getCategoryCircleStyle(category.id),
                ]}
              >
                <MaterialIcons
                  name={category.icon as any}
                  size={18}
                  style={styles.usefulPhonesCategoryIconSymbol}
                />
              </View>
              <Text style={styles.usefulPhonesCategoryTitle}>
                {category.title}
              </Text>
            </View>

            <View>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.usefulPhonesItemRow}
                  activeOpacity={0.75}
                  onPress={() => handleCall(item.phone)}
                >
                  <View style={styles.usefulPhonesItemTextWrapper}>
                    <Text style={styles.usefulPhonesItemLabel}>
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text style={styles.usefulPhonesItemDescription}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.usefulPhonesItemRight}>
                    <Text
                      style={styles.usefulPhonesItemPhone}
                      numberOfLines={1}
                    >
                      {item.phone}
                    </Text>
                    <MaterialIcons
                      name="call"
                      size={18}
                      style={styles.usefulPhonesCallIcon}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

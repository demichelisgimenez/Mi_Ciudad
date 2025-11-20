// app/screens/inicio/components/UsefulPhonesModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import UsefulPhonesSection from "./UsefulPhonesSection";
import { inicioStyles as styles } from "@utils/styles/inicio";

type UsefulPhonesModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function UsefulPhonesModal({
  visible,
  onClose,
}: UsefulPhonesModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.phonesBackdrop}>
        <View style={styles.phonesSheet}>
          <View style={styles.phonesHandle} />

          <View style={styles.phonesHeaderRow}>
            <View style={styles.phonesHeaderLeft}>
              <MaterialIcons
                name="phone-in-talk"
                size={22}
                style={styles.phonesHeaderIcon}
              />
              <View>
                <Text style={styles.phonesTitle}>Teléfonos útiles</Text>
                <Text style={styles.phonesSubtitle}>
                  Emergencias y servicios de Federal
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={22}
                style={styles.phonesHeaderIcon}
              />
            </TouchableOpacity>
          </View>

          <UsefulPhonesSection />
        </View>
      </View>
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Marker } from "react-native-maps";
import { farmaciaStyles as styles } from "@utils/styles/farmacias";
import type { Pharmacy } from "../types";

export default function MarkerFarmacia({
  item,
  selected,
  onPress,
}: {
  item: Pharmacy;
  selected: boolean;
  onPress: (f: Pharmacy) => void;
}) {
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 300);
    return () => clearTimeout(t);
  }, [item.id]);

  const containerStyle = selected ? styles.markerContainerSelected : styles.markerContainerDefault;

  return (
    <Marker
      coordinate={{ latitude: item.lat, longitude: item.lng }}
      onPress={() => onPress(item)}
      tracksViewChanges={tracks}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 999 : 1}
    >
      <View style={containerStyle} collapsable={false} renderToHardwareTextureAndroid pointerEvents="none">
        <Image source={require("../../../../assets/pins/pin-farmacia.png")} style={styles.markerImage} />
      </View>
    </Marker>
  );
}


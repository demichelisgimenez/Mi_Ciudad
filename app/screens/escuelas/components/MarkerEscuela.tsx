import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Marker } from "react-native-maps";
import type { Level, School } from "../types";

const PIN_IMG: Record<Level, any> = {
  Inicial:    require("../../../../assets/pins/pin-inicial.png"),
  Primaria:   require("../../../../assets/pins/pin-primaria.png"),
  Secundaria: require("../../../../assets/pins/pin-secundaria.png"),
  Técnica:    require("../../../../assets/pins/pin-tecnica.png"),
  Superior:   require("../../../../assets/pins/pin-superior.png"),
  Especial:   require("../../../../assets/pins/pin-especial.png"),
  Adultos:    require("../../../../assets/pins/pin-adultos.png"),
};

export function MarkerEscuela({
  school,
  selected,
  onPress,
}: {
  school: School;
  selected: boolean;
  onPress: (s: School) => void;
}) {
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 300);
    return () => clearTimeout(t);
  }, [school.id]);

  return (
    <Marker
      coordinate={{ latitude: school.lat, longitude: school.lng }}
      tracksViewChanges={tracks}
      onPress={() => onPress(school)}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 999 : 1}
    >
      <View
        style={{ width: selected ? 40 : 40, height: selected ? 40 : 40 }}
        collapsable={false}
        renderToHardwareTextureAndroid
        pointerEvents="none"
      >
        <Image
          source={PIN_IMG[school.level]}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>
    </Marker>
  );
}

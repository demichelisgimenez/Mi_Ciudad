import { View, Text, FlatList, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { farmaciasStyles as styles } from "../../../utils/styles/farmacias";
import Button from "@components/Button";

const { height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    nombre: "Farmacia Federal",
    direccion: "Belgrano 450",
    latitude: -30.9555,
    longitude: -58.7830,
  },
  {
    id: "2",
    nombre: "Farmacia Del Pueblo",
    direccion: "9 de Julio 210",
    latitude: -30.9560,
    longitude: -58.7850,
  },
  {
    id: "3",
    nombre: "Farmacia Central",
    direccion: "Antelo 320",
    latitude: -30.9540,
    longitude: -58.7810,
  },
];

export default function Farmacias() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Farmacias en Federal</Text>

      <MapView
        style={{ width: "100%", height: height * 0.3, borderRadius: 8 }}
        initialRegion={{
          latitude: -30.9546,
          longitude: -58.7833,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {DATA.map((farmacia) => (
          <Marker
            key={farmacia.id}
            coordinate={{
              latitude: farmacia.latitude,
              longitude: farmacia.longitude,
            }}
            title={farmacia.nombre}
            description={farmacia.direccion}
          />
        ))}
      </MapView>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.direccion}>{item.direccion}</Text>
            <Button title="Ver más" onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
}
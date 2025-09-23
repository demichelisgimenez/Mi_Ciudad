import { View, Text, FlatList, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { escuelaStyles as styles } from "../../../utils/styles/escuelas";
import Button from "@components/Button";

const { height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    nombre: 'Escuela Nina N° 2 "Justo José de Urquiza"',
    direccion: "Presidente Peron 150",
    latitude: -30.9555,
    longitude: -58.7830,
  },
  {
    id: "2",
    nombre: 'E.E.T. N° 23 "Caudillos Federales"',
    direccion: "Rivadavia 275",
    latitude: -30.9560,
    longitude: -58.7850,
  },
  {
    id: "3",
    nombre: 'Escuela Secundaria N° 2 "José Manuel Estrada"',
    direccion: "Echagüe 320",
    latitude: -30.9540,
    longitude: -58.7810,
  },
];

export default function Escuelas() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Escuelas de la Ciudad de Federal</Text>

      <MapView
        style={{ width: "100%", height: height * 0.3, borderRadius: 20, padding: 10 }}
        initialRegion={{
          latitude: -30.9546,
          longitude: -58.7833,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {DATA.map((escuela) => (
          <Marker
            key={escuela.id}
            coordinate={{
              latitude: escuela.latitude,
              longitude: escuela.longitude,
            }}
            title={escuela.nombre}
            description={escuela.direccion}
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
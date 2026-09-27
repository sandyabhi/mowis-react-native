import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text>Map Screen</Text>

      <MapLibreGL.Map
        style={styles.map}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        <MapLibreGL.Camera zoom={10} center={[-91.7713, 37.9514]} />

        <MapLibreGL.RasterSource
          id="osm"
          tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
          tileSize={256}
        >
          <MapLibreGL.Layer id="osm-layer" type="raster" source="osm" />
        </MapLibreGL.RasterSource>
      </MapLibreGL.Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },
});

// import * as MapLibreGL from "@maplibre/maplibre-react-native";
// import { StyleSheet, Text, View } from "react-native";

// export default function MapScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Map Screen</Text>
//       <MapLibreGL.Map
//         style={styles.map}
//         mapStyle="https://demotiles.maplibre.org/style.json"
//       >
//         <MapLibreGL.Camera zoom={1} center={[-91.7713, 37.9514]} />
//       </MapLibreGL.Map>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

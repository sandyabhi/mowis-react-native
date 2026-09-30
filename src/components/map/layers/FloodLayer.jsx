import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { View } from "react-native";

export default function FloodLayer({ geoJSON, visible = true, onFloodPress }) {
  if (!visible || !geoJSON) return null;

  return (
    <MapLibreGL.GeoJSONSource
      id="flood-source"
      data={geoJSON}
      hitbox={{
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      }}
    >
      <MapLibreGL.Layer
        id="flood-fill-layer"
        type="fill"
        paint={{
          "fill-color": "#ADD8E6",
          "fill-opacity": 0.7,
          "fill-outline-color": "#FF0000",
        }}
      >
        <View onPress={onFloodPress}></View>
      </MapLibreGL.Layer>
    </MapLibreGL.GeoJSONSource>
  );
}

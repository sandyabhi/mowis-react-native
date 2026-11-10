import riverNetwork from "@/assets/geojson/myeditedriverfile.json";
import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function RiverNetworkLayer() {
  return (
    <MapLibreGL.GeoJSONSource id="river-network-source" data={riverNetwork}>
      <MapLibreGL.Layer
        id="river-network-layer"
        type="line"
        paint={{
          "line-color": "#1E90FF",
          "line-width": 1.5,
          "line-opacity": 1,
        }}
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

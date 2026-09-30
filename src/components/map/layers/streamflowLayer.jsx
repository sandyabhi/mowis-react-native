import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function StreamflowLayer({ geoJSON, onSensorPress }) {
  if (!geoJSON) {
    return null;
  }

  return (
    <MapLibreGL.GeoJSONSource
      id="streamflow-source"
      data={geoJSON}
      onPress={onSensorPress}
      hitbox={{
        top: 15,
        right: 15,
        bottom: 15,
        left: 15,
      }}
    >
      <MapLibreGL.Layer
        id="streamflow-layer"
        type="circle"
        paint={{
          "circle-radius": 6,

          "circle-color": [
            "match",
            ["get", "floodCategory"],

            "action",
            "#ffff00",

            "minor",
            "#ffaa00",

            "moderate",
            "#e60000",

            "major",
            "#730000",

            "#1e90ff",
          ],

          "circle-stroke-color": "#111111",
          "circle-stroke-width": 1,
          "circle-opacity": 0.95,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

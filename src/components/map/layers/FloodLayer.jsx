import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function FloodLayer({ geoJSON, visible = true }) {
  if (!visible) {
    return null;
  }

  if (!geoJSON) {
    return null;
  }

  if (!geoJSON.features?.length) {
    return null;
  }

  return (
    <MapLibreGL.GeoJSONSource id="flood-source" data={geoJSON}>
      <MapLibreGL.Layer
        id="flood-fill-layer"
        type="fill"
        paint={{
          "fill-color": "#1591e4",
          "fill-opacity": 0.3,
        }}
      />

      <MapLibreGL.Layer
        id="flood-outline-layer"
        type="line"
        paint={{
          "line-color": "#FF0000",
          "line-width": 4,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

import * as MapLibreGL from "@maplibre/maplibre-react-native";

import missouriBoundary from "@/assets/geojson/MO_boundary.json";

export default function MissouriBoundaryLayer() {
  return (
    <MapLibreGL.GeoJSONSource
      id="missouri-boundary-source"
      data={missouriBoundary}
    >
      <MapLibreGL.Layer
        id="missouri-boundary-layer"
        type="line"
        paint={{
          "line-color": "#000000",
          "line-width": 3,
          "line-opacity": 1,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

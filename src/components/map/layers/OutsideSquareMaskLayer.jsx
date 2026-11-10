import darkerBackground from "@/assets/geojson/DarkerBackground.json";
import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function OutsideSquareMaskLayer() {
  return (
    <MapLibreGL.GeoJSONSource
      id="outside-square-mask-source"
      data={darkerBackground}
    >
      <MapLibreGL.Layer
        id="outside-square-mask-layer"
        type="fill"
        paint={{
          "fill-color": "#333333",
          "fill-opacity": 0.35,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

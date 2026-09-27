import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function BaseMapLayer() {
  return (
    <MapLibreGL.RasterSource
      id="osm-source"
      tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
      tileSize={256}
    >
      <MapLibreGL.Layer id="osm-layer" type="raster" />
    </MapLibreGL.RasterSource>
  );
}

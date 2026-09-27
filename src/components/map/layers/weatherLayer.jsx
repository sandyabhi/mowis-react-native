import * as MapLibreGL from "@maplibre/maplibre-react-native";

import {
  IMAGE_COORDINATES,
  WEATHER_BASE_URL,
} from "../../../constants/mapConfig";

export default function WeatherLayer({ visible, frame = 72 }) {
  if (!visible) {
    return null;
  }

  const imageUrl = `${WEATHER_BASE_URL}/Current${frame}.png`;

  return (
    <MapLibreGL.ImageSource
      id="weather-source"
      url={imageUrl}
      coordinates={IMAGE_COORDINATES}
    >
      <MapLibreGL.Layer
        id="weather-layer"
        type="raster"
        paint={{
          "raster-opacity": 0.7,
        }}
      />
    </MapLibreGL.ImageSource>
  );
}

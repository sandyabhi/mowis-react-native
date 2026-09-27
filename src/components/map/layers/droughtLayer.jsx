import * as MapLibreGL from "@maplibre/maplibre-react-native";

import {
  DROUGHT_BASE_URL,
  IMAGE_COORDINATES,
} from "../../../constants/mapConfig";

export default function DroughtLayer({ visible, imageNumber = 1 }) {
  if (!visible) {
    return null;
  }

  const imageUrl = `${DROUGHT_BASE_URL}/${imageNumber}.png`;

  return (
    <MapLibreGL.ImageSource
      id="drought-source"
      url={imageUrl}
      coordinates={IMAGE_COORDINATES}
    >
      <MapLibreGL.Layer
        id="drought-layer"
        type="raster"
        paint={{
          "raster-opacity": 0.7,
        }}
      />
    </MapLibreGL.ImageSource>
  );
}

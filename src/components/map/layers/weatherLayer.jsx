import * as MapLibreGL from "@maplibre/maplibre-react-native";

import { IMAGE_COORDINATES } from "@/constants/mapConfig";

export default function WeatherLayer({
  visible = true,
  frame = 72,
  type = "Current",
}) {
  if (!visible) {
    return null;
  }

  let imageUrl;
  // https://rainproc.itrss.mst.edu/QPE_products/Animation/Cumulative/Accu0.gif
  switch (type) {
    case "Daily":
      imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Daily/Daily1.gif`;
      break;

    case "Cumulative":
      imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Cumulative/Accu0.gif `;
      break;

    case "Current":
    default:
      imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Rainrate/Current${frame}.gif`;
      break;
  }

  console.log("Weather image:", imageUrl);

  return (
    <MapLibreGL.ImageSource
      id="weather-image-source"
      url={imageUrl}
      coordinates={IMAGE_COORDINATES}
    >
      <MapLibreGL.Layer
        id="weather-image-layer"
        type="raster"
        paint={{
          "raster-opacity": 0.65,
        }}
      />
    </MapLibreGL.ImageSource>
  );
}

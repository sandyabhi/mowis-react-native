import * as MapLibreGL from "@maplibre/maplibre-react-native";

import { IMAGE_COORDINATES } from "@/constants/mapConfig";

const WEATHER_BASE = "https://rainproc.itrss.mst.edu/QPE_products/Animation";

function getWeatherImageUrl(type, index) {
  console.log("=-=-=-=-=-", type);

  switch (type) {
    case "Current":
      return `${WEATHER_BASE}/Rainrate/Current${index}.gif`;

    case "Daily":
      return `${WEATHER_BASE}/Daily/Daily${index}.gif`;

    case "Cumulative":
      return `${WEATHER_BASE}/Cumulative/Accu${index}.gif`;

    default:
      return null;
  }
}

export default function WeatherLayer({
  visible = true,
  frame = 72,
  type = "Current",
}) {
  if (!visible) {
    return null;
  }

  // TODO : frame needs to change dynamically and intial value needs to be different from 1 let it be 1 for now
  // const imageUrl = getWeatherImageUrl(type, 1);
  const imageUrl = getWeatherImageUrl(type, frame);
  console.log("WeatherLayer:", {
    visible,
    type,
    frame,
    imageUrl,
  });

  if (!imageUrl) {
    return null;
  }

  //     <MapLibreGL.ImageSource
  //       id="weather-image-source"
  //       url={imageUrl}
  //       coordinates={IMAGE_COORDINATES}
  //     >
  //       <MapLibreGL.Layer
  //         id="weather-image-layer"
  //         type="raster"
  //         paint={{
  //           "raster-opacity": 0.65,
  //         }}
  //       />
  //     </MapLibreGL.ImageSource>
  //
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

// import * as MapLibreGL from "@maplibre/maplibre-react-native";

// import { IMAGE_COORDINATES } from "@/constants/mapConfig";

// export default function WeatherLayer({
//   visible = true,
//   frame = 72,
//   type = "Current",
// }) {
//   if (!visible) {
//     return null;
//   }

//   let imageUrl;
//   // https://rainproc.itrss.mst.edu/QPE_products/Animation/Cumulative/Accu0.gif
//   switch (type) {
//     case "Daily":
//       imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Daily/Daily1.gif`;
//       break;

//     case "Cumulative":
//       imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Cumulative/Accu0.gif `;
//       break;

//     case "Current":
//     default:
//       imageUrl = `https://rainproc.itrss.mst.edu/QPE_products/Animation/Rainrate/Current${frame}.gif`;
//       break;
//   }

//   console.log("Weather image:", imageUrl);

//   return (
//     <MapLibreGL.ImageSource
//       id="weather-image-source"
//       url={imageUrl}
//       coordinates={IMAGE_COORDINATES}
//     >
//       <MapLibreGL.Layer
//         id="weather-image-layer"
//         type="raster"
//         paint={{
//           "raster-opacity": 0.65,
//         }}
//       />
//     </MapLibreGL.ImageSource>
//   );
// }

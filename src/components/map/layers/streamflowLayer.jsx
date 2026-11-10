import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function StreamflowLayer({
  geoJSON,
  onSensorPress,
  idPrefix = "streamflow",
  related = false,
}) {
  if (!geoJSON?.features?.length) {
    console.log(`${idPrefix}: No features to render`);
    return null;
  }

  console.log(
    `${idPrefix}: Icon values`,
    geoJSON.features.slice(0, 10).map((feature) => ({
      sensorId: feature.properties?.sensorId,
      Icon: feature.properties?.Icon,
    })),
  );

  return (
    <MapLibreGL.GeoJSONSource
      id={`${idPrefix}-source`}
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
        id={`${idPrefix}-layer`}
        type="circle"
        paint={{
          "circle-radius": related ? 9 : 6,

          "circle-color": [
            "match",
            ["get", "Icon"],
            1,
            "#2196f3", // Red
            2,
            "#ff9800", // Orange
            3,
            "#9c27b0", // Purple
            4,
            "#2196f3", // Blue
            5,
            "#ffeb3b", // Yellow
            "#ffeb3b", // Default yellow for undefined or unmatched values
          ],

          "circle-stroke-color": related ? "#ffffff" : "#111111",
          "circle-stroke-width": related ? 2 : 1,
          "circle-opacity": 0.95,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

// import * as MapLibreGL from "@maplibre/maplibre-react-native";

// export default function StreamflowLayer({
//   geoJSON,
//   onSensorPress,
//   idPrefix = "streamflow",
//   related = false,
// }) {
//   if (!geoJSON?.features?.length) {
//     console.log(`${idPrefix}: No features to render`);
//     return null;
//   }

//   console.log("||||||||||||||||||||||||||||");
//   console.log("||||||||||||||||||||||||||||");
//   console.log("||||||||||||||||||||||||||||");
//   console.log("||||||||||||||||||||||||||||");

//   console.log(
//     `${idPrefix}: Icon values`,
//     geoJSON.features.slice(0, 10).map((feature) => ({
//       sensorId: feature.properties?.sensorId,
//       Icon: feature.properties?.Icon,
//     })),
//   );
//   console.log(`${idPrefix}: Rendering ${geoJSON.features.length} features`);

//   return (
//     <MapLibreGL.GeoJSONSource
//       id={`${idPrefix}-source`}
//       data={geoJSON}
//       onPress={onSensorPress}
//       hitbox={{
//         top: 15,
//         right: 15,
//         bottom: 15,
//         left: 15,
//       }}
//     >
//       <MapLibreGL.Layer
//         id={`${idPrefix}-layer`}
//         type="circle"
//         paint={{
//           "circle-radius": related ? 9 : 6,

//           "circle-color": [
//             "match",
//             ["get", "Icon"],
//             1,
//             "#ff0000",
//             2,
//             "#ff9800",
//             3,
//             "#9c27b0",
//             4,
//             "#2196f3",
//             5,
//             "#ffeb3b",
//             "#ffeb3b",

//             "null",
//             "#ffeb3b",
//           ],

//           // "circle-color": related
//           //   ? [
//           //       "match",
//           //       ["get", "Icon"],
//           //       1,
//           //       "#ff0000", // Red
//           //       2,
//           //       "#ff9800", // Orange
//           //       3,
//           //       "#ffeb3b", // Yellow
//           //       4,
//           //       "#2196f3", // Blue
//           //       5,
//           //       "#9c27b0", // Purple
//           //       "#00e676", // Default green
//           //     ]
//           //   : [
//           //       "match",
//           //       ["get", "floodCategory"],
//           //       "action",
//           //       "#ffff00",
//           //       "minor",
//           //       "#ffaa00",
//           //       "moderate",
//           //       "#e60000",
//           //       "major",
//           //       "#730000",
//           //       "#1e90ff",
//           //     ],

//           "circle-stroke-color": related ? "#ffffff" : "#111111",
//           "circle-stroke-width": related ? 2 : 1,
//           "circle-opacity": 0.95,
//         }}
//       />
//     </MapLibreGL.GeoJSONSource>
//   );
// }

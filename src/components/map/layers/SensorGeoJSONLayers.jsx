import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function SensorGeoJSONLayers({ basin, flowlines }) {
  return (
    <>
      {basin && (
        <MapLibreGL.GeoJSONSource
          id="selected-sensor-basin-source"
          data={basin}
        >
          <MapLibreGL.Layer
            id="selected-sensor-basin-fill"
            type="fill"
            paint={{
              "fill-color": "lightblue",
              "fill-opacity": 0.35,
            }}
          />

          <MapLibreGL.Layer
            id="selected-sensor-basin-outline"
            type="line"
            paint={{
              "line-color": "steelblue",
              "line-width": 2,
              "line-opacity": 0.9,
            }}
          />
        </MapLibreGL.GeoJSONSource>
      )}

      {flowlines && (
        <MapLibreGL.GeoJSONSource
          id="selected-sensor-flowlines-source"
          data={flowlines}
        >
          <MapLibreGL.Layer
            id="selected-sensor-flowlines-line"
            type="line"
            paint={{
              "line-color": "blue",
              "line-width": 1.5,
              "line-opacity": 0.9,
            }}
          />
        </MapLibreGL.GeoJSONSource>
      )}
    </>
  );
}

// import * as MapLibreGL from "@maplibre/maplibre-react-native";

// export default function SensorGeoJSONLayers({ basin, flowlines }) {
//   console.log("MapLibre components:", {
//     ShapeSource: typeof MapLibreGL.ShapeSource,
//     FillLayer: typeof MapLibreGL.FillLayer,
//     LineLayer: typeof MapLibreGL.LineLayer,
//   });

//   console.log("-----basin--------", basin);

//   console.log("MapLibre exports:", Object.keys(MapLibreGL));
//   console.log(
//     "MapLibre default export:",
//     Object.keys(MapLibreGL.default ?? {}),
//   );

//   return (
//     <>
//       {basin && (
//         <MapLibreGL.ShapeSource id="selected-sensor-basin-source" shape={basin}>
//           <MapLibreGL.FillLayer
//             id="selected-sensor-basin-fill"
//             style={{
//               fillColor: "lightblue",
//               fillOpacity: 0.35,
//             }}
//           />

//           <MapLibreGL.LineLayer
//             id="selected-sensor-basin-outline"
//             style={{
//               lineColor: "steelblue",
//               lineWidth: 2,
//               lineOpacity: 0.9,
//             }}
//           />
//         </MapLibreGL.ShapeSource>
//       )}

//       {flowlines && (
//         <MapLibreGL.ShapeSource
//           id="selected-sensor-flowlines-source"
//           shape={flowlines}
//         >
//           <MapLibreGL.LineLayer
//             id="selected-sensor-flowlines-line"
//             style={{
//               lineColor: "blue",
//               lineWidth: 1.5,
//               lineOpacity: 0.9,
//             }}
//           />
//         </MapLibreGL.ShapeSource>
//       )}
//     </>
//   );
// }

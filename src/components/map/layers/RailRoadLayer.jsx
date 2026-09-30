import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function RailRoadLayer({
  visible,
  //   networkGeoJSON,
  railroadData,
  onMarkerPress,
}) {
  if (!visible) return null;

  //   if (networkGeoJSON?.features) {
  //     networkGeoJSON.features.forEach((feature, index) => {
  //       const geometry = feature.geometry;

  //       if (!geometry) return;

  //       if (geometry.type === "LineString") {
  //         if (!geometry.coordinates || geometry.coordinates.length < 2) {
  //           console.log(
  //             "BAD RAILROAD LINE:",
  //             index,
  //             feature.properties,
  //             geometry.coordinates,
  //           );
  //         }
  //       }

  //       if (geometry.type === "MultiLineString") {
  //         geometry.coordinates.forEach((line, lineIndex) => {
  //           if (!line || line.length < 2) {
  //             console.log(
  //               "BAD RAILROAD MULTILINE:",
  //               index,
  //               lineIndex,
  //               feature.properties,
  //               line,
  //             );
  //           }
  //         });
  //       }
  //     });
  //   }

  return (
    <>
      {/* {networkGeoJSON && (
        <MapLibreGL.GeoJSONSource
          id="railroad-network-source"
          //   data={networkGeoJSON}
        >
          <MapLibreGL.Layer
            id="railroad-network-layer"
            type="line"
            paint={{
              "line-color": "#795548",
              "line-opacity": 0.8,
              "line-width": 2,
            }}
          />
        </MapLibreGL.GeoJSONSource>
      )} */}

      {railroadData && (
        <RailRoadMarkers data={railroadData} onMarkerPress={onMarkerPress} />
      )}
    </>
  );
}

function RailRoadMarkers({ data, onMarkerPress }) {
  const features = Object.entries(data)
    .filter(([, location]) => {
      return location?.latitude != null && location?.longitude != null;
    })
    .map(([sensorId, location]) => ({
      type: "Feature",
      properties: {
        sensorId,
        siteName: location.site_name,
        reachId: location.reach_id,
      },
      geometry: {
        type: "Point",
        coordinates: [Number(location.longitude), Number(location.latitude)],
      },
    }));

  console.log("Railroad marker count:", features.length);

  console.log("First railroad marker:", features[0]);

  const geoJSON = {
    type: "FeatureCollection",
    features,
  };

  return (
    <MapLibreGL.GeoJSONSource
      id="railroad-markers-source"
      data={geoJSON}
      onPress={onMarkerPress}
      hitbox={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <MapLibreGL.Layer
        id="railroad-markers-layer"
        type="circle"
        paint={{
          "circle-radius": 10,
          "circle-color": "#FF0000",
          "circle-opacity": 1,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

import * as MapLibreGL from "@maplibre/maplibre-react-native";

export default function RailRoadLayer({
  visible,
  showWaterwayCrossings,
  showRailroads,
  railroadData,
  railroadNetworkGeoJSON,
  onMarkerPress,
}) {
  if (!visible) {
    return null;
  }

  /*
   * Convert railroad forecast records into GeoJSON point features.
   */
  const crossingsGeoJSON = {
    type: "FeatureCollection",

    features: Object.entries(railroadData ?? {})
      .map(([id, railroad]) => {
        const longitude = Number(railroad?.longitude);
        const latitude = Number(railroad?.latitude);

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
          return null;
        }

        return {
          type: "Feature",

          properties: {
            id: String(id),
            sensorId: String(id),
            siteName: railroad?.site_name ?? "",
            reachId: railroad?.reach_id ?? "",
          },

          geometry: {
            type: "Point",

            coordinates: [longitude, latitude],
          },
        };
      })
      .filter(Boolean),
  };

  console.log("Waterway crossing markers:", crossingsGeoJSON.features.length);

  const handlePress = (event) => {
    const feature = event?.features?.[0] ?? event?.nativeEvent?.features?.[0];

    if (!feature) {
      console.log("No railroad feature pressed");
      return;
    }

    console.log("Railroad feature pressed:", feature);

    const properties = feature.properties ?? {};

    const id =
      properties.id ??
      properties.sensorId ??
      properties.reach_id ??
      properties.reachId;

    if (!id) {
      console.log("No railroad ID found");
      return;
    }

    const railroad = railroadData?.[String(id)] ?? railroadData?.[id];

    if (!railroad) {
      console.log("No railroad forecast found for:", id);
      return;
    }

    console.log("Opening railroad modal:", railroad);

    onMarkerPress?.(railroad);
  };

  return (
    <>
      {showWaterwayCrossings && crossingsGeoJSON.features.length > 0 && (
        <MapLibreGL.GeoJSONSource
          id="railroad-crossings-source"
          data={crossingsGeoJSON}
          onPress={handlePress}
        >
          <MapLibreGL.Layer
            id="railroad-crossings-layer"
            type="circle"
            paint={{
              "circle-radius": 5,
              "circle-color": "#898989",
              "circle-stroke-width": 1,
              "circle-stroke-color": "#5e5e5e",
            }}
          />
        </MapLibreGL.GeoJSONSource>
      )}

      {showRailroads && railroadNetworkGeoJSON?.features?.length > 0 && (
        <MapLibreGL.GeoJSONSource
          id="railroad-network-source"
          data={railroadNetworkGeoJSON}
        >
          <MapLibreGL.Layer
            id="railroad-network-layer"
            type="line"
            paint={{
              "line-width": 2,
              "line-color": "#795548",
              "line-opacity": 0.9,
            }}
          />
        </MapLibreGL.GeoJSONSource>
      )}
    </>
  );
}

export default function RailRoadMarkers({ data, onMarkerPress }) {
  const features = Object.entries(data)
    .filter(([, location]) => {
      return location.latitude && location.longitude;
    })
    .map(([sensorId, location]) => ({
      type: "Feature",
      properties: {
        sensorId,
        siteName: location.site_name,
        reachId: location.reach_id,
        forecast: location.forecast,
      },
      geometry: {
        type: "Point",
        coordinates: [Number(location.longitude), Number(location.latitude)],
      },
    }));

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
        top: 15,
        right: 15,
        bottom: 15,
        left: 15,
      }}
    >
      <MapLibreGL.Layer
        id="railroad-markers-layer"
        type="circle"
        paint={{
          "circle-radius": 8,
          "circle-color": "#795548",
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
        }}
      />
    </MapLibreGL.GeoJSONSource>
  );
}

export function relatedSensorsToGeoJSON(relatedSensors, selectedSensorId) {
  const features = Object.entries(relatedSensors)
    .map(([id, sensor]) => {
      const longitude = Number(sensor.longitude);
      const latitude = Number(sensor.latitude);

      if (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude)
      ) {
        console.log("Invalid coordinates:", id, sensor);
        return null;
      }

      console.log("========================relatedSensorssGeoJSON");

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          sensorId: String(id),
          siteName: sensor.siteName ?? sensor.name ?? String(id),
          isSelectedSensor: String(id) === String(selectedSensorId),
        },
      };
    })
    .filter(Boolean);

  return {
    type: "FeatureCollection",
    features,
  };
}
function getLastValue(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[array.length - 1];
}

export function streamflowToGeoJSON(data) {
    const features = [];

    Object.entries(data || {}).forEach(
        ([sensorId, sensor]) => {

            if (sensorId === "07040100") return;
            if (sensorId === "07019300") return;

            const latitude = Number(sensor.latitude);
            const longitude = Number(sensor.longitude);

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                return;
            }

            const measurements =
                sensor.measurements || {};

            const streamflows =
                Array.isArray(measurements.sf)
                    ? measurements.sf
                    : [];

            const gaugeHeights =
                Array.isArray(measurements.gh)
                    ? measurements.gh
                    : [];

            const timestamps =
                Array.isArray(measurements.tsp)
                    ? measurements.tsp
                    : [];

            features.push({
                type: "Feature",

                geometry: {
                    type: "Point",
                    coordinates: [
                        longitude,
                        latitude,
                    ],
                },

                properties: {
                    sensorId,

                    siteName:
                        sensor.site_name ||
                        `Sensor ${sensorId}`,

                    latitude,
                    longitude,

                    streamflow:
                        getLastValue(streamflows),

                    gaugeHeight:
                        getLastValue(gaugeHeights),

                    timestamp:
                        getLastValue(timestamps),

                    floodCategory:
                        sensor.flood_levels?.category ||
                        "none",
                },
            });
        }
    );

    return {
        type: "FeatureCollection",
        features,
    };
}
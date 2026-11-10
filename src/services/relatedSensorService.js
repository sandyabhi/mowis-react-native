// export async function fetchRelatedSensorData() {
//     const [sitesResponse, relatedResponse] = await Promise.all([
//         fetch("https://mowaterinfo.itrss.mst.edu/data/ALLsensor_sites.json"),
//         fetch("https://mowaterinfo.itrss.mst.edu/data/sensor_sites.json"),

//     ]);

//     if (!sitesResponse.ok || !relatedResponse.ok) {
//         throw new Error("Failed to load related sensor data");
//     }

//     const [allSitesMap, relatedSensorsMap] = await Promise.all([
//         sitesResponse.json(),
//         relatedResponse.json(),
//     ]);

//     return { allSitesMap, relatedSensorsMap };
// }


export async function fetchRelatedSensorData() {
    const [sitesResponse, relatedResponse] = await Promise.all([
        fetch("https://mowaterinfo.itrss.mst.edu/data/ALLsensor_sites.json"),
        fetch("https://mowaterinfo.itrss.mst.edu/data/sensor_sites.json"),
    ]);

    if (!sitesResponse.ok || !relatedResponse.ok) {
        throw new Error("Failed to load related sensor data");
    }

    const [allSitesMap, relatedSensorsMap] = await Promise.all([
        sitesResponse.json(),
        relatedResponse.json(),
    ]);

    return { allSitesMap, relatedSensorsMap };
}


function findSensorRecord(allSitesMap, sensorId) {
    const id = String(sensorId);

    // First, check whether the ID is a direct key.
    if (allSitesMap?.[id]) {
        return allSitesMap[id];
    }

    // Fallback: find the record by an ID field inside the record.
    for (const [key, record] of Object.entries(allSitesMap ?? {})) {
        if (!record || typeof record !== "object") continue;

        const recordId =
            record.sensor_id ??
            record.sensorId ??
            record.site_id ??
            record.siteId ??
            record.id ??
            key;

        if (String(recordId) === id) {
            return record;
        }
    }

    return null;
}

export function getRelatedSensors(
    sensorId,
    allSitesMap,
    relatedSensorsMap,
    sensorDataById = {},
) {
    const id = String(sensorId);
    const relatedIds = relatedSensorsMap?.[id] ?? [];

    // Include the selected sensor and remove duplicate IDs.
    const ids = [
        ...new Set([id, ...relatedIds.map(String)]),
    ];

    const result = {};

    for (const relatedId of ids) {
        // Look up the complete record in ALLsensor_sites.json.
        const allSitesRecord = findSensorRecord(
            allSitesMap,
            relatedId,
        );

        // Also use any data already loaded from the sensor network.
        const networkRecord = sensorDataById?.[relatedId] ?? {};

        if (!allSitesRecord) {
            console.log(
                `Sensor ${relatedId} was not found in ALLsensor_sites.json`,
            );
        }

        // Preserve data from both sources, including nested measurements
        // and flood-level information.
        const sensor = {
            ...(allSitesRecord ?? {}),
            ...networkRecord,

            measurements: {
                ...(allSitesRecord?.measurements ?? {}),
                ...(networkRecord.measurements ?? {}),
            },

            flood_levels: {
                ...(allSitesRecord?.flood_levels ?? {}),
                ...(networkRecord.flood_levels ?? {}),
            },
        };

        const measurements = sensor.measurements ?? {};

        const hasTimeSeries = Object.values(measurements).some(
            (value) => Array.isArray(value) && value.length > 0,
        );

        result[relatedId] = {
            ...sensor,
            sensor_id: relatedId,
            sensorId: relatedId,

            siteName:
                sensor.site_name ??
                sensor.siteName ??
                `Sensor ${relatedId}`,

            hasTimeSeries,
        };
    }

    console.log("Related sensor records:", result);

    return result;
}
export function getRelatedSensors2(
    sensorId,
    allSitesMap,
    relatedSensorsMap,
    sensorDataById = {},
) {
    const id = String(sensorId);
    const relatedIds = relatedSensorsMap?.[id] ?? [];

    // Include the selected sensor and remove duplicate IDs.
    const ids = [
        ...new Set([id, ...relatedIds.map(String)]),
    ];

    const result = {};

    for (const relatedId of ids) {
        // Look up the complete record in ALLsensor_sites.json.
        const allSitesRecord = findSensorRecord(
            allSitesMap,
            relatedId,
        );

        // Also use any data already loaded from the sensor network.
        const networkRecord = sensorDataById?.[relatedId] ?? {};

        if (!allSitesRecord) {
            console.log(
                `Sensor ${relatedId} was not found in ALLsensor_sites.json`,
            );
        }

        // Preserve data from both sources, including nested measurements
        // and flood-level information.
        const sensor = {
            ...(allSitesRecord ?? {}),
            ...networkRecord,

            measurements: {
                ...(allSitesRecord?.measurements ?? {}),
                ...(networkRecord.measurements ?? {}),
            },

            flood_levels: {
                ...(allSitesRecord?.flood_levels ?? {}),
                ...(networkRecord.flood_levels ?? {}),
            },
        };

        const measurements = sensor.measurements ?? {};

        const hasTimeSeries = Object.values(measurements).some(
            (value) => Array.isArray(value) && value.length > 0,
        );

        result[relatedId] = {
            ...sensor,
            sensor_id: relatedId,
            sensorId: relatedId,

            siteName:
                sensor.site_name ??
                sensor.siteName ??
                `Sensor ${relatedId}`,

            hasTimeSeries,
        };
    }

    console.log("Related sensor records:", result);

    return result;
}


// export function getRelatedSensors(
//     sensorId,
//     allSitesMap,
//     relatedSensorsMap,
//     sensorDataById = {},
// ) {
//     const id = String(sensorId);
//     const relatedIds = relatedSensorsMap[id] ?? [];
//     const result = {};

//     // Include all related sensors.
//     for (const relatedId of relatedIds) {
//         const relatedIdString = String(relatedId);

//         const siteData = allSitesMap[relatedIdString] ?? {};
//         const timeSeriesData = sensorDataById[relatedIdString] ?? {};

//         result[relatedIdString] = {
//             ...siteData,
//             ...timeSeriesData,

//             sensor_id: relatedIdString,
//             sensorId: relatedIdString,

//             // Keep a consistent site name.
//             siteName:
//                 timeSeriesData.site_name ??
//                 siteData.site_name ??
//                 siteData.siteName ??
//                 `Sensor ${relatedIdString}`,

//             // Indicates whether the full API record was found.
//             hasTimeSeries: Object.keys(timeSeriesData).length > 0,
//         };
//     }

//     // Also include the selected sensor.
//     const selectedSiteData = allSitesMap[id] ?? {};
//     const selectedTimeSeriesData = sensorDataById[id] ?? {};

//     result[id] = {
//         ...selectedSiteData,
//         ...selectedTimeSeriesData,

//         sensor_id: id,
//         sensorId: id,

//         siteName:
//             selectedTimeSeriesData.site_name ??
//             selectedSiteData.site_name ??
//             selectedSiteData.siteName ??
//             `Sensor ${id}`,

//         hasTimeSeries: Object.keys(selectedTimeSeriesData).length > 0,
//     };

//     return result;
// }


// export function getRelatedSensors(
//     sensorId,
//     allSitesMap,
//     relatedSensorsMap,
// ) {
//     const id = String(sensorId);
//     const relatedIds = relatedSensorsMap[id] ?? [];
//     const result = {};

//     for (const relatedId of relatedIds) {
//         const relatedSite = allSitesMap[String(relatedId)];

//         if (relatedSite) {
//             result[String(relatedId)] = {
//                 sensor_id: String(relatedId),
//                 ...relatedSite,
//             };
//         }
//     }

//     result[id] = {
//         sensor_id: id,
//         ...(allSitesMap[id] ?? {}),
//     };

//     return result;
// }
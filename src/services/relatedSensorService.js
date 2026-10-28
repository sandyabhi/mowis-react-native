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

export function getRelatedSensors(
    sensorId,
    allSitesMap,
    relatedSensorsMap,
) {
    const id = String(sensorId);
    const relatedIds = relatedSensorsMap[id] ?? [];
    const result = {};

    for (const relatedId of relatedIds) {
        const relatedSite = allSitesMap[String(relatedId)];

        if (relatedSite) {
            result[String(relatedId)] = {
                sensor_id: String(relatedId),
                ...relatedSite,
            };
        }
    }

    result[id] = {
        sensor_id: id,
        ...(allSitesMap[id] ?? {}),
    };

    return result;
}
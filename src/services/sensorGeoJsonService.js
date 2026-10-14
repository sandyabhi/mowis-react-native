const NLDI_BASE =
    "https://api.water.usgs.gov/nldi/linked-data/nwissite";

async function fetchGeoJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`NLDI request failed: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data || !["FeatureCollection", "Feature"].includes(data.type)) {
        throw new Error("NLDI returned an invalid GeoJSON response");
    }

    return data;
}

export async function fetchSensorGeoJSON(sensorId) {
    if (!/^\d{8}$/.test(String(sensorId))) {
        throw new Error("Invalid USGS sensor ID");
    }

    const site = `USGS-${sensorId}`;

    const [basin, flowlines] = await Promise.all([
        fetchGeoJSON(
            `${NLDI_BASE}/${site}/basin?f=json`
        ),
        fetchGeoJSON(
            `${NLDI_BASE}/${site}/navigation/UM/flowlines?distance=999`
        ),
    ]);

    return { basin, flowlines };
}
const CURRENT_FLOOD_URL =
    "https://maps.water.noaa.gov/server/rest/services/nwm/ana_inundation_extent/FeatureServer/0/query?geometry=-95.77,35.99,-89.10,40.61&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outFields=*&f=geojson";

const FIVE_DAY_FLOOD_URL =
    "https://maps.water.noaa.gov/server/rest/services/nwm/mrf_nbm_5day_max_inundation_extent/FeatureServer/0/query?geometry=-95.77,35.99,-89.10,40.61&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outFields=*&f=geojson";

export async function fetchFloodGeoJSON(type) {
    const url =
        type === "5daymax"
            ? FIVE_DAY_FLOOD_URL
            : CURRENT_FLOOD_URL;

    console.log(
        "Fetching flood data:",
        type === "5daymax" ? "5-day maximum" : "current",
    );

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Flood request failed: ${response.status}`);
    }

    const geoJSON = await response.json();

    console.log(
        "Flood features loaded:",
        geoJSON.features?.length ?? 0,
    );

    return geoJSON;
}
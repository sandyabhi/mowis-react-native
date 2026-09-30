const CURRENT_FLOOD_URL =
    "https://maps.water.noaa.gov/server/rest/services/nwm/ana_inundation_extent/FeatureServer/0/query?geometry=-95.77,35.99,-89.10,40.61&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outFields=*&f=geojson";

const FIVE_DAY_FLOOD_URL =
    "https://maps.water.noaa.gov/server/rest/services/nwm/mrf_nbm_5day_max_inundation_extent/FeatureServer/0/query?geometry=-95.77,35.99,-89.10,40.61&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outFields=*&f=geojson";

console.log("Flood URLs:", CURRENT_FLOOD_URL, FIVE_DAY_FLOOD_URL);
export async function fetchFloodGeoJSON(type) {
    const url =
        type === "5daymax"
            ? FIVE_DAY_FLOOD_URL
            : CURRENT_FLOOD_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Flood request failed: ${response.status}`);
    }

    return response.json();
}
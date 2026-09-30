const RAILROAD_FORECAST_URL =
    "https://mowaterinfo.itrss.mst.edu/data/railroad_forecasts.json";

export async function fetchRailroadData() {
    const response = await fetch(RAILROAD_FORECAST_URL);

    if (!response.ok) {
        throw new Error(
            `Railroad forecast request failed: ${response.status}`
        );
    }

    const forecastData = await response.json();

    console.log("Railroad forecast:", forecastData);

    return forecastData;
}


// const RAILROAD_FORECAST_URL =
//     "https://mowaterinfo.itrss.mst.edu/data/railroad_forecasts.json";

// const RAILROAD_NETWORK_URL =
//     "https://mowaterinfo.itrss.mst.edu/assets/railRoadsMO.geojson";

// export async function fetchRailroadData() {
//     const [forecastResponse, networkResponse] = await Promise.all([
//         fetch(RAILROAD_FORECAST_URL),
//         fetch(RAILROAD_NETWORK_URL),
//     ]);

//     if (!forecastResponse.ok) {
//         throw new Error(
//             `Railroad forecast request failed: ${forecastResponse.status}`
//         );
//     }

//     if (!networkResponse.ok) {
//         throw new Error(
//             `Railroad network request failed: ${networkResponse.status}`
//         );
//     }

//     const [forecastData, networkData] = await Promise.all([
//         forecastResponse.json(),
//         networkResponse.json(),
//     ]);

//     console.log(forecastData, networkData, "Raills");


//     return {
//         forecastData,
//         networkData,
//     };
// }

// function cleanRailroadGeoJSON(geoJSON) {
//     if (!geoJSON?.features) return geoJSON;

//     const features = geoJSON.features.filter((feature) => {
//         const geometry = feature.geometry;

//         if (!geometry) return false;

//         if (geometry.type === "LineString") {
//             return geometry.coordinates?.length >= 2;
//         }

//         if (geometry.type === "MultiLineString") {
//             return geometry.coordinates?.some(
//                 (line) => line?.length >= 2
//             );
//         }

//         return true;
//     });

//     console.log(
//         `Railroad features: ${geoJSON.features.length} → ${features.length}`
//     );

//     return {
//         ...geoJSON,
//         features,
//     };
// }
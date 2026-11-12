const RAILROAD_FORECAST_URL =
  "https://mowaterinfo.itrss.mst.edu/data/railroad_forecasts.json";

const RAILROAD_NETWORK_URL =
  "https://mowaterinfo.itrss.mst.edu/assets/railRoadsMO.geojson";

async function fetchJSON(url, name) {
  console.log(`Fetching ${name}:`, url);

  const response = await fetch(url);

  console.log(`${name} status:`, response.status);
  console.log(`${name} content type:`, response.headers.get("content-type"));

  const text = await response.text();

  console.log(`${name} response length:`, text.length);
  console.log(`${name} response preview:`, text.substring(0, 200));

  if (!response.ok) {
    throw new Error(`${name} request failed: ${response.status}`);
  }

  if (!text || !text.trim()) {
    throw new Error(`${name} returned an empty response`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`${name} invalid JSON response:`, text.substring(0, 1000));

    throw new Error(`${name} returned invalid JSON: ${error.message}`);
  }
}

export async function fetchRailroadData() {
  return fetchJSON(RAILROAD_FORECAST_URL, "Railroad forecast");
}

function isValidCoordinate(coordinate) {
  return (
    Array.isArray(coordinate) &&
    coordinate.length >= 2 &&
    Number.isFinite(Number(coordinate[0])) &&
    Number.isFinite(Number(coordinate[1]))
  );
}

function cleanRailroadGeoJSON(geoJSON) {
  if (!geoJSON?.features) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const cleanedFeatures = [];

  geoJSON.features.forEach((feature, featureIndex) => {
    const geometry = feature?.geometry;

    if (!geometry) {
      console.log("Removing feature with no geometry:", featureIndex);
      return;
    }

    if (geometry.type === "LineString") {
      const coordinates = (geometry.coordinates || []).filter(
        isValidCoordinate,
      );

      if (coordinates.length < 2) {
        console.log(
          "Removing invalid LineString:",
          featureIndex,
          geometry.coordinates,
        );
        return;
      }

      cleanedFeatures.push({
        ...feature,
        geometry: {
          ...geometry,
          coordinates,
        },
      });

      return;
    }

    if (geometry.type === "MultiLineString") {
      const validLines = (geometry.coordinates || [])
        .map((line) =>
          Array.isArray(line) ? line.filter(isValidCoordinate) : [],
        )
        .filter((line) => line.length >= 2);

      if (validLines.length === 0) {
        console.log("Removing invalid MultiLineString:", featureIndex);
        return;
      }

      cleanedFeatures.push({
        ...feature,
        geometry: {
          ...geometry,
          coordinates: validLines,
        },
      });

      return;
    }

    console.log("Removing unsupported geometry:", featureIndex, geometry.type);
  });

  console.log(
    `Railroad GeoJSON cleaned: ${geoJSON.features.length} → ${cleanedFeatures.length}`,
  );

  return {
    type: "FeatureCollection",
    features: cleanedFeatures,
  };
}

export async function fetchRailroadNetwork() {
  const data = await fetchJSON(RAILROAD_NETWORK_URL, "Railroad network");

  console.log("Original railroad feature count:", data?.features?.length);

  const cleanedData = cleanRailroadGeoJSON(data);

  console.log("Cleaned railroad feature count:", cleanedData.features.length);

  return cleanedData;
}

// const RAILROAD_FORECAST_URL =
//     "https://mowaterinfo.itrss.mst.edu/data/railroad_forecasts.json";
//
// const RAILROAD_NETWORK_URL =
//     "https://mowaterinfo.itrss.mst.edu/assets/railRoadsMO.geojson";
//
//
// export async function fetchRailroadData() {
//     const response = await fetch(RAILROAD_FORECAST_URL);
//
//     if (!response.ok) {
//         throw new Error(
//             `Railroad forecast request failed: ${response.status}`,
//         );
//     }
//
//     return response.json();
// }
//
//
// function isValidCoordinate(coordinate) {
//     return (
//         Array.isArray(coordinate) &&
//         coordinate.length >= 2 &&
//         Number.isFinite(Number(coordinate[0])) &&
//         Number.isFinite(Number(coordinate[1]))
//     );
// }
//
//
// function cleanRailroadGeoJSON(geoJSON) {
//     if (!geoJSON?.features) {
//         return {
//             type: "FeatureCollection",
//             features: [],
//         };
//     }
//
//     const cleanedFeatures = [];
//
//     geoJSON.features.forEach((feature, featureIndex) => {
//         const geometry = feature?.geometry;
//
//         if (!geometry) {
//             console.log("Removing feature with no geometry:", featureIndex);
//             return;
//         }
//
//         // LineString
//         if (geometry.type === "LineString") {
//             const coordinates = (geometry.coordinates || []).filter(
//                 isValidCoordinate,
//             );
//
//             if (coordinates.length < 2) {
//                 console.log(
//                     "Removing invalid LineString:",
//                     featureIndex,
//                     geometry.coordinates,
//                 );
//                 return;
//             }
//
//             cleanedFeatures.push({
//                 ...feature,
//                 geometry: {
//                     ...geometry,
//                     coordinates,
//                 },
//             });
//
//             return;
//         }
//
//         // MultiLineString
//         if (geometry.type === "MultiLineString") {
//             const validLines = (geometry.coordinates || [])
//                 .map((line) =>
//                     Array.isArray(line) ? line.filter(isValidCoordinate) : [],
//                 )
//                 .filter((line) => line.length >= 2);
//
//             if (validLines.length === 0) {
//                 console.log(
//                     "Removing invalid MultiLineString:",
//                     featureIndex,
//                 );
//                 return;
//             }
//
//             cleanedFeatures.push({
//                 ...feature,
//                 geometry: {
//                     ...geometry,
//                     coordinates: validLines,
//                 },
//             });
//
//             return;
//         }
//
//         // Ignore geometry types that should not be in a railroad line layer
//         console.log(
//             "Removing unsupported geometry:",
//             featureIndex,
//             geometry.type,
//         );
//     });
//
//     console.log(
//         `Railroad GeoJSON cleaned: ${geoJSON.features.length} → ${cleanedFeatures.length}`,
//     );
//
//     return {
//         type: "FeatureCollection",
//         features: cleanedFeatures,
//     };
// }
//
//
// export async function fetchRailroadNetwork() {
//     const response = await fetch(RAILROAD_NETWORK_URL);
//
//     if (!response.ok) {
//         throw new Error(
//             `Railroad network request failed: ${response.status}`,
//         );
//     }
//
//     const data = await response.json();
//
//     console.log(
//         "Original railroad feature count:",
//         data?.features?.length,
//     );
//
//     const cleanedData = cleanRailroadGeoJSON(data);
//
//     console.log(
//         "Cleaned railroad feature count:",
//         cleanedData.features.length,
//     );
//
//     return cleanedData;
// }

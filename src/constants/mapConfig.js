export const MOWIS_BASE_URL =
    "https://mowaterinfo.itrss.mst.edu";

export const STREAMFLOW_URL =
    `${MOWIS_BASE_URL}/data/streamflow.json`;

export const DROUGHT_BASE_URL =
    `${MOWIS_BASE_URL}/assets/USDM_current_M`;

export const WEATHER_BASE_URL =
    "https://rainproc.itrss.mst.edu/QPE_products/Animation/Rainrate";

export const WEATHER_FRAME_COUNT = 72;

export const INITIAL_MAP_CENTER = [
    -92.75,
    38.85,
];

export const INITIAL_MAP_ZOOM = 7;

// ImageSource coordinates:
// top-left
// top-right
// bottom-right
// bottom-left

export const IMAGE_COORDINATES = [
    [-96.14, 41.46],
    [-88.58, 41.46],
    [-88.58, 35.53],
    [-96.14, 35.53],
];
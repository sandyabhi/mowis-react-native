import { MOWIS_BASE_URL } from "@/constants/mapConfig";

export const SENSOR_NETWORKS = [
    {
        id: "streamflow",
        label: "USGS/USACE - Streamflow",
        url: `${MOWIS_BASE_URL}/data/streamflow.json`,
    },
    {
        id: "stageonly",
        label: "USGS/USACE - Stage Only",
        url: `${MOWIS_BASE_URL}/data/stage_only.json`,
    },
    {
        id: "mohic",
        label: "MoHIC - Stage Only",
        url: `${MOWIS_BASE_URL}/data/mohic_sensors.json`,
    },
    {
        id: "nws-forecast",
        label: "NWS Daily Forecast Points (USGS + NWS)",
        url: `${MOWIS_BASE_URL}/data/forecast.json`,
    }
];
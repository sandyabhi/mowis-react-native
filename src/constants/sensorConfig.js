
import { MOWIS_BASE_URL } from "@/constants/mapConfig";

export const SENSOR_NETWORKS = [
    {
        id: "streamflow",
        label: "USGS/USACE - Streamflow",
        url: `${MOWIS_BASE_URL}/data/ALLsensor_sites.json`,
    },
    {
        id: "stage-only",
        label: "USGS/USACE - Stage Only",
        url: `${MOWIS_BASE_URL}/data/REPLACE_WITH_STAGE_ONLY_FILE.json`,
    },
    {
        id: "mohic",
        label: "MoHIC - Stage Only",
        url: `${MOWIS_BASE_URL}/data/REPLACE_WITH_MOHIC_FILE.json`,
    },
    {
        id: "nws-forecast",
        label: "NWS Daily Forecast Points (USGS + NWS)",
        url: `${MOWIS_BASE_URL}/data/REPLACE_WITH_NWS_FILE.json`,
    },
];
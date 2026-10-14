import { STREAMFLOW_URL } from "@/constants/mapConfig";

export async function fetchStreamflowData() {
    const response = await fetch(STREAMFLOW_URL);

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return response.json();
}


export async function fetchSensorData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Confirm the actual structure of each JSON file.
    if (!data || typeof data !== "object") {
        throw new Error("Invalid sensor data format");
    }

    return data;
}
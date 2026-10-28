import { STREAMFLOW_URL } from "@/constants/mapConfig";
import { SENSOR_NETWORKS } from "@/constants/sensorNetworkConfig";

export async function fetchSelectedNetworkData(networkIds) {
    const selected = SENSOR_NETWORKS.filter((network) =>
        networkIds.includes(network.id),
    );

    const results = await Promise.all(
        selected.map(async (network) => {
            const response = await fetch(network.url);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch ${network.label}: HTTP ${response.status}`,
                );
            }

            return {
                networkId: network.id,
                data: await response.json(),
            };
        }),
    );

    return results;
}

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
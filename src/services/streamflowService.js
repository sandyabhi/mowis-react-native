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
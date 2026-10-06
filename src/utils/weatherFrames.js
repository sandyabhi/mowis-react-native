export const CURRENT_FRAME_COUNT = 72;
export const WEATHER_INTERVAL_MINUTES = 5;

export function getCurrentFrameDate(latestDate, frame) {
    if (!latestDate) {
        return null;
    }

    const date = new Date(latestDate);

    const minutesBack =
        (CURRENT_FRAME_COUNT - frame) * WEATHER_INTERVAL_MINUTES;

    date.setMinutes(date.getMinutes() - minutesBack);

    return date;
}
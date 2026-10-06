const LATEST_URL = "https://mowaterinfo.itrss.mst.edu/latest.txt";

const MONTHS = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
};
export async function fetchLatestWeatherTime() {
    const response = await fetch(LATEST_URL);

    console.log("latest.txt response:", response.status);

    if (!response.ok) {
        throw new Error("Failed to fetch latest weather timestamp");
    }

    const content = (await response.text()).trim();

    console.log("latest.txt content:", content);

    const day = Number(content.substring(18, 20));
    const monthStr = content.substring(20, 23);
    const year = Number(content.substring(23, 27));

    const hour = Number(content.substring(28, 30));
    const minute = Number(content.substring(30, 32));
    const second = Number(content.substring(32, 34));

    const month = MONTHS[monthStr];

    if (month === undefined) {
        throw new Error(`Invalid month: ${monthStr}`);
    }

    const date = new Date(
        Date.UTC(
            year,
            month,
            day,
            hour,
            minute,
            second
        )
    );

    console.log("Parsed latest weather date:", date.toISOString());

    return date;
}

// export async function fetchLatestWeatherTime() {
//     const response = await fetch(LATEST_URL);

//     if (!response.ok) {
//         throw new Error("Failed to fetch latest weather timestamp");
//     }

//     const content = (await response.text()).trim();

//     const day = Number(content.substring(18, 20));
//     const monthStr = content.substring(20, 23);
//     const year = Number(content.substring(23, 27));

//     const hour = Number(content.substring(28, 30));
//     const minute = Number(content.substring(30, 32));
//     const second = Number(content.substring(32, 34));

//     const month = MONTHS[monthStr];

//     if (month === undefined) {
//         throw new Error(`Invalid month: ${monthStr}`);
//     }

//     return new Date(
//         Date.UTC(
//             year,
//             month,
//             day,
//             hour,
//             minute,
//             second
//         )
//     );
// }
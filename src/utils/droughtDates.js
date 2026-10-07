const pad = (value) => String(value).padStart(2, "0");

export function formatDate(date) {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`;
}

export function getMostRecentThursday(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay();
  const daysSinceThursday = (day + 3) % 7;
  result.setDate(result.getDate() - daysSinceThursday);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getDroughtDates(count = 9) {
  const latestThursday = getMostRecentThursday();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(latestThursday);

    date.setDate(latestThursday.getDate() - index * 7);

    return {
      date: formatDate(date),
      imageNumber: index + 1,
    };
  });
}

import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const CHART_HEIGHT = 190;

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getTimestamp(value) {
  if (!value) return null;

  const timestamp = new Date(String(value).replace(" ", "T")).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function formatDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "numeric",
  });
}

function buildValueMap(values, timestamps) {
  const map = new Map();

  if (!Array.isArray(values) || !Array.isArray(timestamps)) {
    return map;
  }

  values.forEach((value, index) => {
    const timestamp = getTimestamp(timestamps[index]);
    const number = toNumber(value);

    if (timestamp !== null && number !== null) {
      map.set(timestamp, number);
    }
  });

  return map;
}

export default function SensorChart({
  title,
  values = [],
  timestamps = [],
  forecastValues = [],
  forecastTimestamps = [],
  yAxisLabel = "",
  chartWidth = 300,
}) {
  const { observedData, forecastData, maxValue } = useMemo(() => {
    const observedMap = buildValueMap(values, timestamps);

    const forecastMap = buildValueMap(forecastValues, forecastTimestamps);

    // Combine and sort all observed and forecast timestamps.
    const timeline = [
      ...new Set([...observedMap.keys(), ...forecastMap.keys()]),
    ].sort((a, b) => a - b);

    // Both datasets use exactly the same timeline.
    const observed = timeline.map((timestamp) => ({
      value: observedMap.has(timestamp) ? observedMap.get(timestamp) : null,
      label: formatDate(timestamp),
      date: timestamp,
    }));

    const forecast = timeline.map((timestamp) => ({
      value: forecastMap.has(timestamp) ? forecastMap.get(timestamp) : null,
      label: formatDate(timestamp),
      date: timestamp,
    }));

    const allValues = [...observedMap.values(), ...forecastMap.values()];

    return {
      observedData: observed,
      forecastData: forecast,
      maxValue: Math.max(1, ...allValues) * 1.1,
    };
  }, [values, timestamps, forecastValues, forecastTimestamps]);

  const hasObserved = observedData.some((point) => point.value !== null);
  const hasForecast = forecastData.some((point) => point.value !== null);

  if (!hasObserved && !hasForecast) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const spacing = 35;
  const calculatedWidth = Math.max(
    chartWidth - 55,
    observedData.length * spacing,
  );

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.legend}>
        {hasObserved && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.observed]} />
            <Text style={styles.legendText}>Observed</Text>
          </View>
        )}

        {hasForecast && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.forecast]} />
            <Text style={styles.legendText}>Forecast</Text>
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        nestedScrollEnabled
        contentContainerStyle={styles.chartScrollContent}
      >
        <LineChart
          data={observedData}
          data2={forecastData}
          width={calculatedWidth}
          height={CHART_HEIGHT}
          // Smooth curves
          curved
          curvature={0.2}
          // Separate area fills
          areaChart1
          areaChart2
          startFillColor1="#7C3AED"
          endFillColor1="#7C3AED"
          startOpacity1={0.28}
          endOpacity1={0.02}
          startFillColor2="#2563EB"
          endFillColor2="#2563EB"
          startOpacity2={0.25}
          endOpacity2={0.02}
          gradientDirection="vertical"
          // Line colors
          color1="#7C3AED"
          color2="#2563EB"
          thickness1={2.5}
          thickness2={2.5}
          // Data points
          hideDataPoints={false}
          hideDataPoints2={false}
          dataPointsColor1="#7C3AED"
          dataPointsColor2="#2563EB"
          dataPointsRadius1={3}
          dataPointsRadius2={3}
          // Preserve timestamp alignment
          interpolateMissingValues={false}
          spacing={spacing}
          initialSpacing={10}
          endSpacing={15}
          hideRules={false}
          rulesColor="#DDDDDD"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          xAxisLabelsHeight={45}
          xAxisLabelsVerticalShift={5}
          xAxisColor="#CCCCCC"
          yAxisLabelSuffix={yAxisLabel}
          maxValue={maxValue}
          noOfSections={4}
          isAnimated={false}
          adjustToWidth={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 10,
  },
  legend: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendLine: {
    width: 20,
    height: 3,
    marginRight: 6,
  },
  observed: {
    backgroundColor: "#7C3AED",
  },
  forecast: {
    backgroundColor: "#2563EB",
  },
  legendText: {
    fontSize: 11,
    color: "#555555",
  },
  axisText: {
    fontSize: 10,
    color: "#666666",
  },
  chartScrollContent: {
    paddingRight: 10,
  },
  empty: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
  },
});

// import { useMemo } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { LineChart } from "react-native-gifted-charts";

// const CHART_HEIGHT = 190;
// const MAX_CHART_POINTS = 100;

// const FLOOD_COLORS = {
//   action: "#EBD700",
//   minor: "#FFA500",
//   moderate: "#E10000",
//   major: "#800080",
// };

// function toNumber(value) {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   const number = Number(value);
//   return Number.isFinite(number) ? number : null;
// }

// function formatDate(value) {
//   if (!value) return "";

//   const date = new Date(String(value).replace(" ", "T"));

//   if (Number.isNaN(date.getTime())) return "";

//   return date.toLocaleString("en-US", {
//     month: "2-digit",
//     day: "numeric",
//   });
// }

// function downsamplePoints(points, maxPoints = MAX_CHART_POINTS) {
//   if (points.length <= maxPoints) return points;

//   const result = [];
//   const interval = (points.length - 1) / (maxPoints - 1);

//   for (let i = 0; i < maxPoints; i++) {
//     result.push(points[Math.round(i * interval)]);
//   }

//   return result;
// }

// function buildChartPoints(values, timestamps) {
//   if (!Array.isArray(values) || !Array.isArray(timestamps)) {
//     return [];
//   }

//   const points = values
//     .map((value, index) => {
//       const number = toNumber(value);

//       if (number === null || !timestamps[index]) {
//         return null;
//       }

//       return {
//         value: number,
//         label: formatDate(timestamps[index]),
//         date: timestamps[index],
//       };
//     })
//     .filter(Boolean);

//   return downsamplePoints(points);
// }

// export default function SensorChart({
//   title,
//   observedValues = [],
//   observedTimestamps = [],
//   forecastValues = [],
//   forecastTimestamps = [],
//   yAxisLabel = "",
//   floodLevels,
//   chartWidth = 300,
// }) {
//   const { chartData, maxValue, referenceLines } = useMemo(() => {
//     const observed = buildChartPoints(observedValues, observedTimestamps).map(
//       (point) => ({
//         ...point,
//         dataPointColor: "#219653",
//         color: "#219653",
//       }),
//     );

//     const forecast = buildChartPoints(forecastValues, forecastTimestamps).map(
//       (point) => ({
//         ...point,
//         dataPointColor: "#36A2EB",
//         color: "#36A2EB",
//       }),
//     );

//     const allValues = [
//       ...observed.map((p) => p.value),
//       ...forecast.map((p) => p.value),
//     ];

//     const thresholds = Object.entries(FLOOD_COLORS)
//       .map(([level, color]) => ({
//         level,
//         color,
//         value: toNumber(floodLevels?.[level]),
//       }))
//       .filter((item) => item.value !== null);

//     const highest = Math.max(
//       1,
//       ...allValues,
//       ...thresholds.map((t) => t.value),
//     );

//     const maxValue = highest + Math.abs(highest) * 0.1;

//     const referenceLines = thresholds.map((item) => ({
//       value: item.value,
//       color: item.color,
//       thickness: 2,
//       dashWidth: 0,
//       dashGap: 0,
//     }));

//     return {
//       chartData: [...observed, ...forecast],
//       maxValue,
//       referenceLines,
//     };
//   }, [
//     observedValues,
//     observedTimestamps,
//     forecastValues,
//     forecastTimestamps,
//     floodLevels,
//   ]);

//   if (!chartData.length) {
//     return (
//       <View style={styles.empty}>
//         <Text style={styles.emptyText}>
//           No observed or forecast data available
//         </Text>
//       </View>
//     );
//   }

//   const spacing = 35;

//   const chartWidthCalculated = Math.max(
//     chartWidth - 55,
//     chartData.length * spacing,
//   );

//   return (
//     <View style={[styles.container, { width: chartWidth }]}>
//       <Text style={styles.title}>{title}</Text>

//       <View style={styles.legend}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendLine, styles.observed]} />
//           <Text style={styles.legendText}>Observed</Text>
//         </View>

//         <View style={styles.legendItem}>
//           <View style={[styles.legendLine, styles.forecast]} />
//           <Text style={styles.legendText}>Forecast</Text>
//         </View>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator
//         nestedScrollEnabled
//         contentContainerStyle={styles.chartScrollContent}
//       >
//         <LineChart
//           data={chartData}
//           areaChart={false}
//           color="#219653"
//           width={chartWidthCalculated}
//           height={CHART_HEIGHT}
//           spacing={spacing}
//           initialSpacing={10}
//           endSpacing={15}
//           thickness={2}
//           hideDataPoints={false}
//           hideRules={false}
//           rulesColor="#DDDDDD"
//           yAxisTextStyle={styles.axisText}
//           xAxisLabelTextStyle={styles.axisText}
//           xAxisLabelsHeight={45}
//           xAxisLabelsVerticalShift={5}
//           xAxisColor="#CCCCCC"
//           yAxisLabelSuffix={yAxisLabel}
//           maxValue={maxValue}
//           noOfSections={4}
//           isAnimated={false}
//           referenceLines={referenceLines}
//         />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#222222",
//   },
//   legend: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   legendLine: {
//     width: 20,
//     height: 3,
//     marginRight: 6,
//   },
//   observed: {
//     backgroundColor: "#219653",
//   },
//   forecast: {
//     backgroundColor: "#36A2EB",
//   },
//   legendText: {
//     fontSize: 12,
//     color: "#555555",
//   },
//   axisText: {
//     fontSize: 10,
//     color: "#666666",
//   },
//   chartScrollContent: {
//     paddingRight: 10,
//   },
//   empty: {
//     padding: 20,
//     alignItems: "center",
//   },
//   emptyText: {
//     color: "#777777",
//     fontSize: 13,
//   },
// });

// import { useMemo } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { LineChart } from "react-native-gifted-charts";

// const CHART_HEIGHT = 190;
// const MAX_CHART_POINTS = 100;

// const FLOOD_COLORS = {
//   action: "#EBD700",
//   minor: "#FFA500",
//   moderate: "#E10000",
//   major: "#800080",
// };

// function toNumber(value) {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   const number = Number(value);
//   return Number.isFinite(number) ? number : null;
// }

// function formatDate(value) {
//   if (!value) return "";

//   // Handle timestamps consistently.
//   const date = new Date(String(value).replace(" ", "T"));

//   if (Number.isNaN(date.getTime())) return "";

//   return date.toLocaleString("en-US", {
//     month: "2-digit",
//     day: "numeric",
//     // hour: "numeric",
//     // hour12: true,
//   });
// }

// function downsamplePoints(points, maxPoints = MAX_CHART_POINTS) {
//   if (points.length <= maxPoints) {
//     return points;
//   }

//   const result = [];
//   const interval = (points.length - 1) / (maxPoints - 1);

//   for (let i = 0; i < maxPoints; i++) {
//     result.push(points[Math.round(i * interval)]);
//   }

//   return result;
// }

// function buildForecastPoints(values, timestamps) {
//   if (!Array.isArray(values) || !Array.isArray(timestamps)) {
//     return [];
//   }

//   const points = values
//     .map((value, index) => {
//       const number = toNumber(value);

//       if (number === null || !timestamps[index]) {
//         return null;
//       }

//       return {
//         value: number,
//         label: formatDate(timestamps[index]),
//         date: timestamps[index],
//       };
//     })
//     .filter(Boolean);

//   return downsamplePoints(points);
// }

// export default function SensorChart({
//   title,
//   forecastValues = [],
//   forecastTimestamps = [],
//   yAxisLabel = "",
//   floodLevels,
//   chartWidth = 300,
// }) {
//   const { forecastData, maxValue, referenceLines } = useMemo(() => {
//     const forecastData = buildForecastPoints(
//       forecastValues,
//       forecastTimestamps,
//     ).map((point) => ({
//       value: point.value,
//       label: point.label,
//       date: point.date,
//     }));

//     const thresholds = Object.entries(FLOOD_COLORS)
//       .map(([level, color]) => ({
//         level,
//         color,
//         value: toNumber(floodLevels?.[level]),
//       }))
//       .filter((item) => item.value !== null);

//     const allValues = [
//       ...forecastData.map((point) => point.value),
//       ...thresholds.map((item) => item.value),
//     ];

//     const highest = allValues.length ? Math.max(...allValues) : 1;

//     const lowest = allValues.length ? Math.min(...allValues) : 0;

//     const maxValue = Math.max(1, highest + Math.abs(highest) * 0.1, lowest + 1);

//     const referenceLines = thresholds.map((item) => ({
//       value: item.value,
//       color: item.color,
//       thickness: 2,
//       dashWidth: 0,
//       dashGap: 0,
//     }));

//     return {
//       forecastData,
//       maxValue,
//       referenceLines,
//     };
//   }, [forecastValues, forecastTimestamps, floodLevels]);

//   if (!forecastData.length) {
//     return (
//       <View style={styles.empty}>
//         <Text style={styles.emptyText}>No forecast data available</Text>
//       </View>
//     );
//   }

//   const spacing = 35;

//   const chartWidthCalculated = Math.max(
//     chartWidth - 55,
//     forecastData.length * spacing,
//   );

//   console.log("FORECAST CHART:", {
//     points: forecastData.length,
//     firstPoint: forecastData[0],
//     lastPoint: forecastData[forecastData.length - 1],
//     chartWidth: chartWidthCalculated,
//   });

//   return (
//     <View style={[styles.container, { width: chartWidth }]}>
//       <Text style={styles.title}>{title} Forecast</Text>

//       <View style={styles.legend}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendLine, styles.forecast]} />
//           <Text style={styles.legendText}>Forecast</Text>
//         </View>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator
//         nestedScrollEnabled
//         contentContainerStyle={styles.chartScrollContent}
//       >
//         <LineChart
//           data={forecastData}
//           areaChart={false}
//           color="#36A2EB"
//           width={chartWidthCalculated}
//           height={CHART_HEIGHT}
//           spacing={spacing}
//           initialSpacing={10}
//           endSpacing={15}
//           thickness={2}
//           hideDataPoints={false}
//           hideRules={false}
//           rulesColor="#DDDDDD"
//           yAxisTextStyle={styles.axisText}
//           xAxisLabelTextStyle={styles.axisText}
//           xAxisLabelsHeight={45}
//           xAxisLabelsVerticalShift={5}
//           xAxisColor="#CCCCCC"
//           yAxisLabelSuffix={yAxisLabel}
//           maxValue={maxValue}
//           noOfSections={4}
//           isAnimated={false}
//           referenceLines={referenceLines}
//         />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#222222",
//   },
//   legend: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   legendLine: {
//     width: 20,
//     height: 3,
//     marginRight: 6,
//   },
//   forecast: {
//     backgroundColor: "#36A2EB",
//   },
//   legendText: {
//     fontSize: 12,
//     color: "#555555",
//   },
//   axisText: {
//     fontSize: 10,
//     color: "#666666",
//   },
//   chartScrollContent: {
//     paddingRight: 10,
//   },
//   empty: {
//     padding: 20,
//     alignItems: "center",
//   },
//   emptyText: {
//     color: "#777777",
//     fontSize: 13,
//   },
// });

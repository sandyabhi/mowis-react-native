import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MAX_POINTS = 30;
const CHART_HEIGHT = 190;

const FLOOD_COLORS = {
  action: "#EBD700",
  minor: "#FFA500",
  moderate: "#E10000",
  major: "#800080",
};

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function buildPoints(values, timestamps) {
  if (!Array.isArray(values)) return [];

  return values
    .map((value, index) => {
      const number = toNumber(value);
      if (number === null) return null;

      return {
        value: number,
        label: formatDate(timestamps?.[index]),
        date: timestamps?.[index] ?? null,
      };
    })
    .filter(Boolean)
    .slice(-MAX_POINTS);
}

export default function SensorChart({
  title,
  values = [],
  timestamps = [],
  forecastValues = [],
  forecastTimestamps = [],
  yAxisLabel = "",
  floodLevels,
  chartWidth = 300,
}) {
  const { observedData, forecastData, hasForecast, maxValue, referenceLines } =
    useMemo(() => {
      const observed = buildPoints(values, timestamps);
      const forecast = buildPoints(forecastValues, forecastTimestamps);

      const hasForecast = forecast.length > 0;

      // Keep forecast on the same x-axis timeline as observed data.
      // Null entries create a gap instead of drawing a line down to zero.
      const alignedForecast = hasForecast
        ? [
            ...observed.map(() => ({
              value: null,
              label: "",
              hideDataPoint: true,
            })),
            ...forecast,
          ]
        : [];

      const thresholds = Object.entries(FLOOD_COLORS)
        .map(([level, color]) => ({
          level,
          color,
          value: toNumber(floodLevels?.[level]),
        }))
        .filter((item) => item.value !== null);

      const allValues = [
        ...observed.map((point) => point.value),
        ...forecast.map((point) => point.value),
        ...thresholds.map((item) => item.value),
      ];

      const highest = allValues.length ? Math.max(...allValues) : 1;

      const lowest = allValues.length ? Math.min(...allValues) : 0;

      // Avoid clipping thresholds above the observed/forecast values.
      const maxValue = Math.max(1, highest + Math.abs(highest) * 0.1);

      const referenceLines = thresholds.map((item) => ({
        value: item.value,
        color: item.color,
        thickness: 2,
        dashWidth: 0,
        dashGap: 0,
      }));

      return {
        observedData: observed.map((point) => ({
          value: point.value,
          label: point.label,
        })),
        forecastData: alignedForecast,
        hasForecast,
        maxValue: Math.max(maxValue, lowest + 1),
        referenceLines,
      };
    }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

  if (!observedData.length && !hasForecast) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  const pointCount = observedData.length + forecastData.length;
  const spacing = Math.max(
    5,
    Math.min(14, (chartWidth - 60) / Math.max(pointCount, 2)),
  );

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.legend}>
        {observedData.length > 0 && (
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

      <LineChart
        data={observedData}
        data2={hasForecast ? forecastData : undefined}
        areaChart
        areaChart2={hasForecast}
        startFillColor="#490676"
        endFillColor="#a408bc"
        startOpacity={0.2}
        endOpacity={0.02}
        startFillColor2="#ba5004"
        endFillColor2="#d29118"
        startOpacity2={0.2}
        endOpacity2={0.02}
        color="#13118A"
        color2="#36A2EB"
        width={chartWidth - 55}
        height={CHART_HEIGHT}
        spacing={spacing}
        initialSpacing={5}
        endSpacing={5}
        thickness={2}
        thickness2={2}
        hideDataPoints
        hideRules={false}
        rulesColor="#DDDDDD"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        yAxisLabelSuffix={yAxisLabel}
        maxValue={maxValue}
        noOfSections={4}
        isAnimated={false}
        disableScroll
        referenceLines={referenceLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingTop: 4,
    overflow: "hidden",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222222",
  },
  legend: {
    flexDirection: "row",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendLine: {
    width: 20,
    height: 3,
    marginRight: 6,
    borderRadius: 2,
  },
  observed: {
    backgroundColor: "#13118A",
  },
  forecast: {
    backgroundColor: "#36A2EB",
  },
  legendText: {
    fontSize: 11,
    color: "#555555",
  },
  axisText: {
    fontSize: 9,
    color: "#666666",
  },
  empty: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#777777",
    fontSize: 12,
  },
});

// import { useMemo } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { LineChart } from "react-native-gifted-charts";

// const MAX_POINTS = 30;
// const CHART_HEIGHT = 190;

// function toNumber(value) {
//   if (value === null || value === undefined || value === "") {
//     return null;
//   }

//   const number = Number(value);
//   return Number.isFinite(number) ? number : null;
// }

// function formatDate(value) {
//   if (!value) return "";

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "";

//   return date.toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//   });
// }

// function buildPoints(values = [], timestamps = []) {
//   if (!Array.isArray(values)) return [];

//   return values
//     .map((value, index) => {
//       const number = toNumber(value);
//       if (number === null) return null;

//       return {
//         value: number,
//         label: formatDate(timestamps?.[index]),
//       };
//     })
//     .filter(Boolean)
//     .slice(-MAX_POINTS);
// }

// export default function SensorChart({
//   title,
//   values = [],
//   timestamps = [],
//   forecastValues = [],
//   forecastTimestamps = [],
//   yAxisLabel = "",
//   floodLevels,
//   chartWidth = 300,
// }) {
//   const { observedData, forecastData, thresholds, maxValue } = useMemo(() => {
//     const observed = buildPoints(values, timestamps);
//     const forecast = buildPoints(forecastValues, forecastTimestamps);

//     // Use null gaps rather than zero placeholders. This avoids
//     // drawing the forecast line down to zero during observed data.
//     const observedChart = observed.map((point) => ({
//       value: point.value,
//       label: point.label,
//     }));

//     const hasObserved = observed.length > 0;
//     const hasForecast = forecast.length > 0;

//     const forecastChart = hasForecast
//       ? [
//           ...observed.map(() => ({
//             value: null,
//             hideDataPoint: true,
//             hideLabel: true,
//           })),
//           ...forecast.map((point) => ({
//             value: point.value,
//             label: point.label,
//           })),
//         ]
//       : [];

//     const thresholdDefinitions = [
//       { name: "Action", key: "action", color: "#EBD700" },
//       { name: "Minor", key: "minor", color: "#FFA500" },
//       { name: "Moderate", key: "moderate", color: "#E10000" },
//       { name: "Major", key: "major", color: "#800080" },
//     ];

//     const availableThresholds = thresholdDefinitions
//       .map((item) => ({
//         ...item,
//         value: toNumber(floodLevels?.[item.key]),
//       }))
//       .filter((item) => item.value !== null);

//     const allValues = [
//       ...observed.map((point) => point.value),
//       ...forecast.map((point) => point.value),
//       ...availableThresholds.map((item) => item.value),
//     ];

//     const highest = allValues.length ? Math.max(...allValues) : 1;

//     return {
//       observedData: observedChart,
//       forecastData: forecastChart,
//       thresholds: availableThresholds,
//       maxValue: highest > 0 ? highest * 1.15 : 1,
//     };
//   }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

//   if (!observedData.length && !forecastData.length) {
//     return (
//       <View style={styles.empty}>
//         {" "}
//         <Text style={styles.emptyText}>No chart data available</Text>{" "}
//       </View>
//     );
//   }

//   const totalPoints = Math.max(
//     observedData.length + forecastData.length - observedData.length,
//     2,
//   );

//   const spacing = Math.max(5, Math.min(14, (chartWidth - 60) / totalPoints));

//   return (
//     <View style={[styles.container, { width: chartWidth }]}>
//       {" "}
//       <Text style={styles.title}>{title}</Text>
//       <View style={styles.legend}>
//         {observedData.length > 0 && (
//           <LegendItem color="#13118A" label="Observed" />
//         )}

//         {forecastData.length > 0 && (
//           <LegendItem color="#36A2EB" label="Forecast" />
//         )}

//         {thresholds.map((threshold) => (
//           <LegendItem
//             key={threshold.key}
//             color={threshold.color}
//             label={threshold.name}
//           />
//         ))}
//       </View>
//       <LineChart
//         data={observedData}
//         data2={forecastData.length ? forecastData : undefined}
//         width={chartWidth - 45}
//         height={CHART_HEIGHT}
//         spacing={spacing}
//         initialSpacing={5}
//         endSpacing={5}
//         thickness={2}
//         thickness2={2}
//         color="#13118A"
//         color2="#36A2EB"
//         hideDataPoints
//         hideRules={false}
//         rulesColor="#DDDDDD"
//         yAxisTextStyle={styles.axisText}
//         xAxisLabelTextStyle={styles.axisText}
//         yAxisLabelSuffix={yAxisLabel}
//         maxValue={maxValue}
//         noOfSections={4}
//         isAnimated={false}
//         disableScroll
//         areaChart
//         startFillColor="#13118A"
//         endFillColor="#13118A"
//         startOpacity={0.22}
//         endOpacity={0.04}
//         areaChart2={forecastData.length > 0}
//         startFillColor2="#36A2EB"
//         endFillColor2="#36A2EB"
//         startOpacity2={0.22}
//         endOpacity2={0.04}
//         showReferenceLine1={thresholds.some((item) => item.key === "action")}
//         referenceLine1Config={{
//           ...(thresholds.find((item) => item.key === "action")
//             ? { value: thresholds.find((item) => item.key === "action").value }
//             : {}),
//           color: "#EBD700",
//           thickness: 1.5,
//           dashWidth: 0,
//         }}
//         showReferenceLine2={thresholds.some((item) => item.key === "minor")}
//         referenceLine2Config={{
//           ...(thresholds.find((item) => item.key === "minor")
//             ? { value: thresholds.find((item) => item.key === "minor").value }
//             : {}),
//           color: "#FFA500",
//           thickness: 1.5,
//           dashWidth: 0,
//         }}
//         showReferenceLine3={thresholds.some((item) => item.key === "moderate")}
//         referenceLine3Config={{
//           ...(thresholds.find((item) => item.key === "moderate")
//             ? {
//                 value: thresholds.find((item) => item.key === "moderate").value,
//               }
//             : {}),
//           color: "#E10000",
//           thickness: 1.5,
//           dashWidth: 0,
//         }}
//       />
//       {/* Major is included in the legend above. This library's common
//       reference-line API exposes three reference lines; see note below. */}
//     </View>
//   );
// }

// function LegendItem({ color, label }) {
//   return (
//     <View style={styles.legendItem}>
//       <View style={[styles.legendLine, { backgroundColor: color }]} />{" "}
//       <Text style={styles.legendText}>{label}</Text>{" "}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 8,
//     paddingTop: 4,
//     overflow: "hidden",
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: "700",
//     marginBottom: 8,
//     color: "#222222",
//   },
//   legend: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 8,
//     rowGap: 6,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   legendLine: {
//     width: 18,
//     height: 3,
//     marginRight: 5,
//     borderRadius: 2,
//   },
//   legendText: {
//     fontSize: 10,
//     color: "#555555",
//   },
//   axisText: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   empty: {
//     height: 80,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyText: {
//     color: "#777777",
//     fontSize: 12,
//   },
// });

// // import { useMemo } from "react";
// // import { StyleSheet, Text, View } from "react-native";
// // import { LineChart } from "react-native-gifted-charts";

// // const MAX_POINTS = 30;
// // const CHART_HEIGHT = 190;

// // function toNumber(value) {
// //   if (value === null || value === undefined || value === "") {
// //     return null;
// //   }

// //   const number = Number(value);
// //   return Number.isFinite(number) ? number : null;
// // }

// // function formatDate(value) {
// //   if (!value) return "";

// //   const date = new Date(value);
// //   if (Number.isNaN(date.getTime())) return "";

// //   return date.toLocaleDateString(undefined, {
// //     month: "short",
// //     day: "numeric",
// //   });
// // }

// // function buildPoints(values = [], timestamps = []) {
// //   if (!Array.isArray(values)) return [];

// //   return values
// //     .map((value, index) => {
// //       const number = toNumber(value);
// //       if (number === null) return null;

// //       return {
// //         value: number,
// //         label: formatDate(timestamps?.[index]),
// //       };
// //     })
// //     .filter(Boolean)
// //     .slice(-MAX_POINTS);
// // }

// // export default function SensorChart({
// //   title,
// //   values = [],
// //   timestamps = [],
// //   forecastValues = [],
// //   forecastTimestamps = [],
// //   yAxisLabel = "",
// //   floodLevels,
// //   chartWidth = 300,
// // }) {
// //   const { observedData, forecastData, maxValue } = useMemo(() => {
// //     const observed = buildPoints(values, timestamps);
// //     const forecast = buildPoints(forecastValues, forecastTimestamps);

// //     // Use one shared timeline. Forecast values begin after observed values.
// //     const observedChart = observed.map((point) => ({
// //       value: point.value,
// //       label: point.label,
// //     }));

// //     const forecastChart = [
// //       ...observed.map(() => ({
// //         value: 0,
// //         hideDataPoint: true,
// //         hideLabel: true,
// //       })),
// //       ...forecast.map((point) => ({
// //         value: point.value,
// //         label: point.label,
// //       })),
// //     ];

// //     const thresholds = [
// //       floodLevels?.action,
// //       floodLevels?.minor,
// //       floodLevels?.moderate,
// //       floodLevels?.major,
// //     ]
// //       .map(toNumber)
// //       .filter((value) => value !== null);

// //     const allValues = [
// //       ...observed.map((point) => point.value),
// //       ...forecast.map((point) => point.value),
// //       ...thresholds,
// //     ];

// //     const highest = allValues.length ? Math.max(...allValues) : 1;

// //     return {
// //       observedData: observedChart,
// //       forecastData: forecastChart,
// //       maxValue: highest > 0 ? highest * 1.15 : 1,
// //     };
// //   }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

// //   if (!observedData.length && !forecastData.length) {
// //     return (
// //       <View style={styles.empty}>
// //         {" "}
// //         <Text style={styles.emptyText}>No chart data available</Text>{" "}
// //       </View>
// //     );
// //   }

// //   const totalPoints = Math.max(observedData.length, forecastData.length, 2);

// //   // Keep the chart within the available card width.
// //   const spacing = Math.max(5, Math.min(14, (chartWidth - 55) / totalPoints));

// //   return (
// //     <View style={[styles.container, { width: chartWidth }]}>
// //       {" "}
// //       <Text style={styles.title}>{title}</Text>
// //       ```
// //       <View style={styles.legend}>
// //         <View style={styles.legendItem}>
// //           <View style={[styles.legendLine, styles.observed]} />
// //           <Text style={styles.legendText}>Observed</Text>
// //         </View>

// //         {forecastData.length > observedData.length && (
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendLine, styles.forecast]} />
// //             <Text style={styles.legendText}>Forecast</Text>
// //           </View>
// //         )}
// //       </View>
// //       <LineChart
// //         data={observedData}
// //         data2={
// //           forecastData.length > observedData.length ? forecastData : undefined
// //         }
// //         width={chartWidth - 45}
// //         height={CHART_HEIGHT}
// //         spacing={spacing}
// //         initialSpacing={5}
// //         endSpacing={5}
// //         thickness={2}
// //         thickness2={2}
// //         color="#13118A"
// //         color2="#36A2EB"
// //         hideDataPoints
// //         hideRules={false}
// //         rulesColor="#DDDDDD"
// //         yAxisTextStyle={styles.axisText}
// //         xAxisLabelTextStyle={styles.axisText}
// //         yAxisLabelSuffix={yAxisLabel}
// //         maxValue={maxValue}
// //         noOfSections={4}
// //         isAnimated={false}
// //         disableScroll
// //       />
// //       {floodLevels && <FloodLevelLegend floodLevels={floodLevels} />}
// //     </View>
// //   );
// // }

// // function FloodLevelLegend({ floodLevels }) {
// //   const levels = [
// //     { name: "Action", value: floodLevels.action, color: "#EBD700" },
// //     { name: "Minor", value: floodLevels.minor, color: "#FFA500" },
// //     { name: "Moderate", value: floodLevels.moderate, color: "#E10000" },
// //     { name: "Major", value: floodLevels.major, color: "#800080" },
// //   ].filter((level) => toNumber(level.value) !== null);

// //   if (!levels.length) return null;

// //   return (
// //     <View style={styles.floodContainer}>
// //       {levels.map((level) => (
// //         <View key={level.name} style={styles.floodItem}>
// //           <View style={[styles.legendLine, { backgroundColor: level.color }]} />{" "}
// //           <Text style={styles.floodText}>
// //             {level.name}: {toNumber(level.value).toFixed(2)}{" "}
// //           </Text>{" "}
// //         </View>
// //       ))}{" "}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     marginTop: 8,
// //     paddingTop: 4,
// //     overflow: "hidden",
// //   },
// //   title: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     marginBottom: 8,
// //     color: "#222222",
// //   },
// //   legend: {
// //     flexDirection: "row",
// //     marginBottom: 8,
// //   },
// //   legendItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginRight: 16,
// //   },
// //   legendLine: {
// //     width: 20,
// //     height: 3,
// //     marginRight: 6,
// //     borderRadius: 2,
// //   },
// //   observed: {
// //     backgroundColor: "#13118A",
// //   },
// //   forecast: {
// //     backgroundColor: "#36A2EB",
// //   },
// //   legendText: {
// //     fontSize: 11,
// //     color: "#555555",
// //   },
// //   axisText: {
// //     fontSize: 9,
// //     color: "#666666",
// //   },
// //   floodContainer: {
// //     marginTop: 8,
// //   },
// //   floodItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 5,
// //   },
// //   floodText: {
// //     fontSize: 10,
// //     color: "#555555",
// //   },
// //   empty: {
// //     height: 80,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   emptyText: {
// //     color: "#777777",
// //     fontSize: 12,
// //   },
// // });

// // import { useMemo } from "react";

// // import { StyleSheet, Text, View } from "react-native";
// // import { LineChart } from "react-native-gifted-charts";

// // const MAX_POINTS = 30;
// // const CHART_HEIGHT = 170;

// // function toNumber(value) {
// //   if (value === null || value === undefined || value === "") {
// //     return null;
// //   }

// //   const number = Number(value);
// //   return Number.isFinite(number) ? number : null;
// // }

// // function formatDate(value) {
// //   if (!value) return "";

// //   const date = new Date(value);
// //   if (Number.isNaN(date.getTime())) return "";

// //   return date.toLocaleDateString(undefined, {
// //     month: "short",
// //     day: "numeric",
// //   });
// // }

// // function buildPoints(values = [], timestamps = []) {
// //   if (!Array.isArray(values)) return [];

// //   return values
// //     .map((value, index) => {
// //       const numericValue = toNumber(value);
// //       if (numericValue === null) return null;

// //       return {
// //         value: numericValue,
// //         label: formatDate(timestamps?.[index]),
// //       };
// //     })
// //     .filter(Boolean)
// //     .slice(-MAX_POINTS)
// //     .map((point, index, array) => ({
// //       value: point.value,
// //       // Avoid drawing a label for every point.
// //       label:
// //         index === 0 || index === array.length - 1 || index % 6 === 0
// //           ? point.label
// //           : "",
// //     }));
// // }

// // export default function SensorChart({
// //   title,
// //   values = [],
// //   timestamps = [],
// //   forecastValues = [],
// //   forecastTimestamps = [],
// //   yAxisLabel = "",
// //   floodLevels,
// //   chartWidth = 280,
// // }) {
// //   const { historicalData, forecastData, maxValue } = useMemo(() => {
// //     const historical = buildPoints(values, timestamps);
// //     const forecast = buildPoints(forecastValues, forecastTimestamps);

// //     const thresholdValues = [
// //       floodLevels?.action,
// //       floodLevels?.minor,
// //       floodLevels?.moderate,
// //       floodLevels?.major,
// //     ]
// //       .map(toNumber)
// //       .filter((value) => value !== null);

// //     const allValues = [
// //       ...historical.map((point) => point.value),
// //       ...forecast.map((point) => point.value),
// //       ...thresholdValues,
// //     ];

// //     const highest = allValues.length ? Math.max(...allValues) : 1;

// //     return {
// //       historicalData: historical,
// //       forecastData: forecast,
// //       maxValue: highest > 0 ? highest * 1.15 : 1,
// //     };
// //   }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

// //   if (!historicalData.length && !forecastData.length) {
// //     return (
// //       <View style={styles.empty}>
// //         <Text style={styles.emptyText}>No chart data available</Text>
// //       </View>
// //     );
// //   }

// //   // Keep the chart width bounded and spacing small.
// //   const pointCount = Math.max(historicalData.length, forecastData.length, 2);
// //   const spacing = Math.max(4, Math.min(12, (chartWidth - 48) / pointCount));

// //   return (
// //     <View style={[styles.container, { width: chartWidth }]}>
// //       <Text style={styles.title}>{title}</Text>

// //       <View style={styles.legend}>
// //         {historicalData.length > 0 && (
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendLine, styles.observed]} />
// //             <Text style={styles.legendText}>Observed</Text>
// //           </View>
// //         )}

// //         {forecastData.length > 0 && (
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendLine, styles.forecast]} />
// //             <Text style={styles.legendText}>Forecast</Text>
// //           </View>
// //         )}
// //       </View>

// //       {historicalData.length > 0 && (
// //         <LineChart
// //           data={historicalData}
// //           width={chartWidth - 40}
// //           height={CHART_HEIGHT}
// //           spacing={spacing}
// //           initialSpacing={6}
// //           endSpacing={6}
// //           thickness={2}
// //           color="#13118A"
// //           hideDataPoints
// //           hideRules={false}
// //           rulesColor="#DDDDDD"
// //           yAxisTextStyle={styles.axisText}
// //           xAxisLabelTextStyle={styles.axisText}
// //           yAxisLabelSuffix={yAxisLabel}
// //           maxValue={maxValue}
// //           noOfSections={4}
// //           isAnimated={false}
// //           disableScroll
// //         />
// //       )}

// //       {forecastData.length > 0 && (
// //         <Text style={styles.forecastHeading}>Forecast</Text>
// //       )}

// //       {forecastData.length > 0 && (
// //         <LineChart
// //           data={forecastData}
// //           width={chartWidth - 40}
// //           height={CHART_HEIGHT}
// //           spacing={spacing}
// //           initialSpacing={6}
// //           endSpacing={6}
// //           thickness={2}
// //           color="#36A2EB"
// //           hideDataPoints
// //           hideRules={false}
// //           rulesColor="#DDDDDD"
// //           yAxisTextStyle={styles.axisText}
// //           xAxisLabelTextStyle={styles.axisText}
// //           yAxisLabelSuffix={yAxisLabel}
// //           maxValue={maxValue}
// //           noOfSections={4}
// //           isAnimated={false}
// //           disableScroll
// //         />
// //       )}

// //       {floodLevels && <FloodLevelLegend floodLevels={floodLevels} />}
// //     </View>
// //   );
// // }

// // function FloodLevelLegend({ floodLevels }) {
// //   const levels = [
// //     { name: "Action", value: floodLevels.action, color: "#EBD700" },
// //     { name: "Minor", value: floodLevels.minor, color: "#FFA500" },
// //     { name: "Moderate", value: floodLevels.moderate, color: "#E10000" },
// //     { name: "Major", value: floodLevels.major, color: "#800080" },
// //   ];

// //   const availableLevels = levels.filter(
// //     (level) => toNumber(level.value) !== null,
// //   );

// //   if (!availableLevels.length) return null;

// //   return (
// //     <View style={styles.floodContainer}>
// //       {availableLevels.map((level) => (
// //         <View key={level.name} style={styles.floodItem}>
// //           <View style={[styles.legendLine, { backgroundColor: level.color }]} />
// //           <Text style={styles.floodText}>
// //             {level.name}: {formatThreshold(level.value)}
// //           </Text>
// //         </View>
// //       ))}
// //     </View>
// //   );
// // }

// // function formatThreshold(value) {
// //   const number = toNumber(value);
// //   return number === null ? String(value) : number.toFixed(2);
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     marginTop: 5,
// //     paddingTop: 3,
// //     overflow: "hidden",
// //   },
// //   title: {
// //     fontSize: 13,
// //     fontWeight: "700",
// //     marginBottom: 6,
// //     color: "#222222",
// //   },
// //   legend: {
// //     flexDirection: "row",
// //     marginBottom: 5,
// //   },
// //   legendItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginRight: 14,
// //   },
// //   legendLine: {
// //     width: 18,
// //     height: 3,
// //     marginRight: 5,
// //     borderRadius: 2,
// //   },
// //   observed: {
// //     backgroundColor: "#13118A",
// //   },
// //   forecast: {
// //     backgroundColor: "#36A2EB",
// //   },
// //   legendText: {
// //     fontSize: 10,
// //     color: "#555555",
// //   },
// //   axisText: {
// //     fontSize: 9,
// //     color: "#666666",
// //   },
// //   forecastHeading: {
// //     fontSize: 11,
// //     fontWeight: "600",
// //     marginTop: 8,
// //     marginBottom: 2,
// //   },
// //   floodContainer: {
// //     marginTop: 6,
// //   },
// //   floodItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 4,
// //   },
// //   floodText: {
// //     fontSize: 10,
// //     color: "#555555",
// //   },
// //   empty: {
// //     height: 70,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   emptyText: {
// //     color: "#777777",
// //     fontSize: 12,
// //   },
// // });

// // import { useMemo } from "react";
// // import { StyleSheet, Text, View } from "react-native";
// // import { LineChart } from "react-native-gifted-charts";

// // function toNumber(value) {
// //   const number = Number(value);
// //   return Number.isFinite(number) ? number : null;
// // }

// // function buildPoints(values = [], timestamps = []) {
// //   return values
// //     .map((value, index) => {
// //       const numericValue = toNumber(value);

// //       if (numericValue === null) {
// //         return null;
// //       }

// //       const timestamp = timestamps[index];

// //       return {
// //         value: numericValue,
// //         date: timestamp ? new Date(timestamp) : null,
// //       };
// //     })
// //     .filter(Boolean);
// // }

// // function formatDate(date) {
// //   if (!date || Number.isNaN(date.getTime())) {
// //     return "";
// //   }

// //   return date.toLocaleDateString(undefined, {
// //     month: "short",
// //     day: "numeric",
// //   });
// // }

// // export default function SensorChart({
// //   title,
// //   values = [],
// //   timestamps = [],
// //   forecastValues = [],
// //   forecastTimestamps = [],
// //   yAxisLabel,
// //   floodLevels,
// // }) {
// //   const { historicalData, forecastData, maxValue } = useMemo(() => {
// //     const historical = buildPoints(values, timestamps);
// //     const forecast = buildPoints(forecastValues, forecastTimestamps);

// //     const historicalChart = historical.map((point) => ({
// //       value: point.value,
// //       label: formatDate(point.date),
// //       dataPointText: "",
// //     }));

// //     const forecastChart = forecast.map((point) => ({
// //       value: point.value,
// //       label: formatDate(point.date),
// //       dataPointText: "",
// //     }));

// //     const allValues = [
// //       ...historical.map((item) => item.value),
// //       ...forecast.map((item) => item.value),
// //       ...Object.values(floodLevels || {})
// //         .map(toNumber)
// //         .filter(Boolean),
// //     ];

// //     const max = allValues.length ? Math.max(...allValues) : 10;

// //     return {
// //       historicalData: historicalChart,
// //       forecastData: forecastChart,
// //       maxValue: max,
// //     };
// //   }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

// //   if (!historicalData.length && !forecastData.length) {
// //     return (
// //       <View style={styles.empty}>
// //         <Text style={styles.emptyText}>No chart data available</Text>
// //       </View>
// //     );
// //   }

// //   /*
// //    * Keep forecast aligned after the historical data.
// //    * This reproduces the web implementation where the
// //    * forecast dataset is preceded by null values.
// //    */
// //   const forecastWithGap = [
// //     ...historicalData.map(() => ({
// //       value: 0,
// //       hideDataPoint: true,
// //       hideLabel: true,
// //     })),
// //     ...forecastData,
// //   ];

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>{title}</Text>

// //       <View style={styles.legend}>
// //         <View style={styles.legendItem}>
// //           <View style={[styles.legendLine, styles.observed]} />
// //           <Text style={styles.legendText}>Observed</Text>
// //         </View>

// //         {forecastData.length > 0 && (
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendLine, styles.forecast]} />
// //             <Text style={styles.legendText}>Forecast</Text>
// //           </View>
// //         )}
// //       </View>

// //       <LineChart
// //         data={historicalData}
// //         data2={forecastData.length ? forecastWithGap : undefined}
// //         height={220}
// //         spacing={45}
// //         initialSpacing={10}
// //         endSpacing={10}
// //         thickness={2}
// //         thickness2={2}
// //         curved
// //         curvature={0.15}
// //         areaChart
// //         areaChart2={forecastData.length > 0}
// //         startFillColor="rgba(19,17,138,0.20)"
// //         endFillColor="rgba(19,17,138,0.02)"
// //         startFillColor2="rgba(54,162,235,0.20)"
// //         endFillColor2="rgba(54,162,235,0.02)"
// //         color="#13118A"
// //         color2="#36A2EB"
// //         hideDataPoints
// //         hideRules={false}
// //         rulesColor="#dddddd"
// //         yAxisTextStyle={styles.axisText}
// //         xAxisLabelTextStyle={styles.axisText}
// //         yAxisLabelSuffix={yAxisLabel}
// //         maxValue={maxValue * 1.1}
// //         noOfSections={5}
// //         isAnimated={false}
// //         pointerConfig={{
// //           pointerStripHeight: 180,
// //           pointerStripColor: "#999",
// //           pointerColor: "#333",
// //           radius: 5,
// //           pointerLabelWidth: 120,
// //           pointerLabelHeight: 60,
// //           activatePointersOnLongPress: true,
// //           autoAdjustPointerLabelPosition: true,
// //           pointerLabelComponent: (items) => {
// //             const item = items?.[0];

// //             return (
// //               <View style={styles.tooltip}>
// //                 <Text style={styles.tooltipValue}>{item?.value ?? "N/A"}</Text>

// //                 {item?.label ? (
// //                   <Text style={styles.tooltipDate}>{item.label}</Text>
// //                 ) : null}
// //               </View>
// //             );
// //           },
// //         }}
// //       />

// //       {floodLevels && <FloodLevelLegend floodLevels={floodLevels} />}
// //     </View>
// //   );
// // }

// // function FloodLevelLegend({ floodLevels }) {
// //   const levels = [
// //     {
// //       name: "Action",
// //       value: floodLevels.action,
// //       color: "#EBD700",
// //     },
// //     {
// //       name: "Minor",
// //       value: floodLevels.minor,
// //       color: "#FFA500",
// //     },
// //     {
// //       name: "Moderate",
// //       value: floodLevels.moderate,
// //       color: "#E10000",
// //     },
// //     {
// //       name: "Major",
// //       value: floodLevels.major,
// //       color: "#800080",
// //     },
// //   ];

// //   return (
// //     <View style={styles.floodContainer}>
// //       {levels.map((level) => {
// //         if (level.value === null || level.value === undefined) {
// //           return null;
// //         }

// //         return (
// //           <View key={level.name} style={styles.floodItem}>
// //             <View
// //               style={[styles.floodLine, { backgroundColor: level.color }]}
// //             />

// //             <Text style={styles.floodText}>
// //               {level.name}: {level.value} ft
// //             </Text>
// //           </View>
// //         );
// //       })}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     marginTop: 16,
// //     paddingTop: 4,
// //   },

// //   title: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     marginBottom: 8,
// //   },

// //   legend: {
// //     flexDirection: "row",
// //     marginBottom: 8,
// //   },

// //   legendItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginRight: 18,
// //   },

// //   legendLine: {
// //     width: 22,
// //     height: 3,
// //     marginRight: 6,
// //     borderRadius: 2,
// //   },

// //   observed: {
// //     backgroundColor: "#13118A",
// //   },

// //   forecast: {
// //     backgroundColor: "#36A2EB",
// //   },

// //   legendText: {
// //     fontSize: 12,
// //     color: "#555",
// //   },

// //   axisText: {
// //     fontSize: 10,
// //     color: "#666",
// //   },

// //   tooltip: {
// //     backgroundColor: "white",
// //     paddingHorizontal: 8,
// //     paddingVertical: 6,
// //     borderRadius: 6,
// //     elevation: 4,
// //   },

// //   tooltipValue: {
// //     fontSize: 12,
// //     fontWeight: "700",
// //   },

// //   tooltipDate: {
// //     fontSize: 10,
// //     color: "#666",
// //   },

// //   floodContainer: {
// //     marginTop: 10,
// //   },

// //   floodItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 5,
// //   },

// //   floodLine: {
// //     width: 22,
// //     height: 2,
// //     marginRight: 7,
// //   },

// //   floodText: {
// //     fontSize: 11,
// //     color: "#555",
// //   },

// //   empty: {
// //     height: 180,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   emptyText: {
// //     color: "#777",
// //   },
// // });

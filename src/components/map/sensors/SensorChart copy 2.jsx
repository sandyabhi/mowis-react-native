import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MAX_POINTS = 400;
const CHART_HEIGHT = 190;

const FLOOD_COLORS = {
  action: "#EBD700",
  minor: "#FFA500",
  moderate: "#E10000",
  major: "#800080",
};

function getDateKey(timestamp) {
  if (!timestamp) return null;

  return String(timestamp).substring(0, 10);
}

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

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  });
}

// function buildPoints(values, timestamps) {
//   if (!Array.isArray(values)) return [];

//   return values
//     .map((value, index) => {
//       const number = toNumber(value);

//       if (number === null) return null;

//       return {
//         value: number,
//         label: formatDate(timestamps?.[index]),
//         date: timestamps?.[index] ?? null,
//       };
//     })
//     .filter(Boolean)
//     .slice(-MAX_POINTS);
// }

const MAX_CHART_POINTS = 100;

function downsamplePoints(points, maxPoints = MAX_CHART_POINTS) {
  if (points.length <= maxPoints) {
    return points;
  }

  const result = [];

  const interval = (points.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.round(i * interval);
    result.push(points[index]);
  }

  return result;
}

function buildPoints(values, timestamps) {
  if (!Array.isArray(values)) return [];

  const points = values
    .map((value, index) => {
      const number = toNumber(value);

      if (number === null) return null;

      return {
        value: number,
        label: formatDate(timestamps?.[index]),
        date: timestamps?.[index] ?? null,
      };
    })
    .filter(Boolean);

  // Preserve the full date range while reducing rendering workload.
  return downsamplePoints(points, MAX_CHART_POINTS);
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
  // --------------------------------------------------
  // 1. RAW DATA LOGS
  // --------------------------------------------------

  console.log("\n========== SENSOR CHART DEBUG ==========");
  console.log("TITLE:", title);

  console.log("RAW OBSERVED DATA:", {
    valuesLength: values?.length,
    timestampsLength: timestamps?.length,
    firstTimestamp: timestamps?.[0],
    lastTimestamp: timestamps?.[timestamps.length - 1],
  });

  console.log("RAW FORECAST DATA:", {
    forecastValuesLength: forecastValues?.length,
    forecastTimestampsLength: forecastTimestamps?.length,
    firstForecastTimestamp: forecastTimestamps?.[0],
    lastForecastTimestamp: forecastTimestamps?.[forecastTimestamps.length - 1],
  });

  // --------------------------------------------------
  // 2. PROCESS DATA
  // --------------------------------------------------

  const {
    observedData,
    forecastData,
    alignedObserved,
    hasForecast,
    maxValue,
    referenceLines,
  } = useMemo(() => {
    const observed = buildPoints(values, timestamps);
    const forecast = buildPoints(forecastValues, forecastTimestamps);

    // Last observed timestamp
    // const lastObservedTimestamp = observed[observed.length - 1]?.date ?? null;

    const lastObservedTimestamp = observed[observed.length - 1]?.date ?? null;

    const lastObservedDate = getDateKey(lastObservedTimestamp);

    const futureForecast = lastObservedDate
      ? forecast.filter((point) => {
          const forecastDate = getDateKey(point.date);

          return forecastDate && forecastDate > lastObservedDate;
        })
      : forecast;
    // --------------------------------------------------
    // 3. REMOVE FORECAST POINTS THAT OVERLAP OBSERVED DATA
    // --------------------------------------------------

    // Timestamp format expected:
    // YYYY-MM-DD HH:mm:ss
    //
    // Lexicographical comparison works for this
    // consistently formatted timestamp structure.

    // const futureForecast = lastObservedTimestamp
    //   ? forecast.filter(
    //       (point) =>
    //         point.date && String(point.date) > String(lastObservedTimestamp),
    //     )
    //   : forecast;

    const hasForecast = futureForecast.length > 0;

    // --------------------------------------------------
    // 4. ALIGN FORECAST WITH OBSERVED DATA
    // --------------------------------------------------

    // Add null values before forecast starts.

    // Prepare observed data

    // Prepare observed data
    const observedData = observed.map((point) => ({
      value: point.value,
      label: point.label,
    }));

    // Forecast starts after the last observed point.
    const alignedForecast = [
      ...observedData.map(() => ({
        value: null,
        hideDataPoint: true,
        label: "",
      })),
      ...futureForecast.map((point) => ({
        value: point.value,
        label: "",
        hideDataPoint: false,
      })),
    ];

    // Extend the primary data series into the future.
    // Put forecast timestamps on the primary series so the X-axis
    // displays November 2 onward instead of stopping at November 1.
    const alignedObserved = [
      ...observedData,
      ...futureForecast.map((point) => ({
        value: null,
        hideDataPoint: true,
        label: point.label,
      })),
    ];

    const forecastData = alignedForecast;

    // const alignedForecast = hasForecast
    //   ? [
    //       ...observed.map(() => ({
    //         value: null,
    //         label: "",
    //         hideDataPoint: true,
    //       })),

    //       ...futureForecast.map((point) => ({
    //         value: point.value,
    //         label: point.label,
    //       })),
    //     ]
    //   : [];

    // --------------------------------------------------
    // 5. FLOOD THRESHOLDS
    // --------------------------------------------------

    const thresholds = Object.entries(FLOOD_COLORS)
      .map(([level, color]) => ({
        level,
        color,
        value: toNumber(floodLevels?.[level]),
      }))
      .filter((item) => item.value !== null);

    const allValues = [
      ...observed.map((point) => point.value),
      ...futureForecast.map((point) => point.value),
      ...thresholds.map((item) => item.value),
    ];

    const highest = allValues.length ? Math.max(...allValues) : 1;

    const lowest = allValues.length ? Math.min(...allValues) : 0;

    const maxValue = Math.max(1, highest + Math.abs(highest) * 0.1, lowest + 1);

    const referenceLines = thresholds.map((item) => ({
      value: item.value,
      color: item.color,
      thickness: 2,
      dashWidth: 0,
      dashGap: 0,
    }));

    // --------------------------------------------------
    // 6. PREPARE CHART DATA
    // --------------------------------------------------

    // const observedData = observed.map((point) => ({
    //   value: point.value,
    //   label: point.label,
    // }));

    // const forecastData = alignedForecast;

    // --------------------------------------------------
    // 7. PROCESSED DATA LOGS
    // --------------------------------------------------
    console.log("\n========== FORECAST SOURCE ANALYSIS ==========");

    console.log("OBSERVED RANGE:", {
      first: observed[0]?.date,
      last: observed[observed.length - 1]?.date,
    });

    console.log("FORECAST RANGE:", {
      first: forecast[0]?.date,
      last: forecast[forecast.length - 1]?.date,
    });

    console.log("FORECAST FIRST 10 POINTS:");

    console.log(
      forecast.slice(0, 10).map((point) => ({
        timestamp: point.date,
        value: point.value,
      })),
    );

    console.log("==============================================");

    console.log("\n---------- PROCESSED OBSERVED DATA ----------");

    console.log({
      length: observedData.length,
      firstPoint: observedData[0],
      lastPoint: observedData[observedData.length - 1],
      firstTimestamp: observed[0]?.date,
      lastTimestamp: observed[observed.length - 1]?.date,
    });

    console.log("\n---------- PROCESSED FORECAST DATA ----------");

    console.log({
      originalForecastLength: forecast.length,
      futureForecastLength: futureForecast.length,
      alignedForecastLength: forecastData.length,
      firstFutureForecast: futureForecast[0],
      lastFutureForecast: futureForecast[futureForecast.length - 1],
      hasForecast,
    });

    console.log("\n---------- ALIGNED FORECAST DATA ----------");

    console.log({
      length: forecastData.length,
      firstPoint: forecastData[0],
      firstActualForecastPoint: forecastData[observedData.length],
      lastPoint: forecastData[forecastData.length - 1],
      observedPaddingLength: observedData.length,
    });

    console.log("\n---------- FLOOD THRESHOLDS ----------");

    console.log({
      thresholds,
      maxValue,
      lowest,
      highest,
    });

    console.log("============================================\n");

    return {
      observedData,
      forecastData,
      alignedObserved,
      hasForecast,
      maxValue,
      referenceLines,
    };
  }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

  // --------------------------------------------------
  // 8. EMPTY DATA CHECK
  // --------------------------------------------------

  if (!observedData.length && !hasForecast) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // 9. CHART DIMENSIONS
  // --------------------------------------------------

  const pointCount = Math.max(observedData.length, forecastData.length);

  const spacing = 14;

  const chartWidthCalculated = Math.max(chartWidth - 55, pointCount * spacing);

  console.log("CHART DIMENSIONS:", {
    observedLength: observedData.length,
    forecastLength: forecastData.length,
    pointCount,
    spacing,
    chartWidthCalculated,
  });

  // --------------------------------------------------
  // 10. RENDER CHART
  // --------------------------------------------------

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        nestedScrollEnabled
        contentContainerStyle={styles.chartScrollContent}
      >
        <LineChart
          data={alignedObserved}
          data2={hasForecast ? forecastData : undefined}
          strokeDashArray2={[5, 4]}
          areaChart={false}
          areaChart2={false}
          startFillColor="#13118A"
          endFillColor="#13118A"
          startOpacity={0.2}
          endOpacity={0.02}
          startFillColor2="#36A2EB"
          endFillColor2="#36A2EB"
          startOpacity2={0.2}
          endOpacity2={0.02}
          color="#13118A"
          color2="#36A2EB"
          width={chartWidthCalculated}
          height={CHART_HEIGHT}
          spacing={spacing}
          initialSpacing={10}
          endSpacing={15}
          thickness={2}
          thickness2={2}
          hideDataPoints
          hideRules={false}
          rulesColor="#DDDDDD"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          xAxisLabelsHeight={35}
          xAxisLabelsVerticalShift={5}
          xAxisColor="#CCCCCC"
          yAxisLabelSuffix={yAxisLabel}
          maxValue={maxValue}
          noOfSections={4}
          isAnimated={false}
          referenceLines={referenceLines}
        />
      </ScrollView>
    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

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

  chartScrollContent: {
    paddingRight: 16,
  },
});

// import { useMemo } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { LineChart } from "react-native-gifted-charts";

// const MAX_POINTS = 120;
// const CHART_HEIGHT = 190;

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

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "";

//   return date.toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//   });
// }

// function buildPoints(values, timestamps) {
//   if (!Array.isArray(values)) return [];

//   return values
//     .map((value, index) => {
//       const number = toNumber(value);
//       if (number === null) return null;

//       return {
//         value: number,
//         label: formatDate(timestamps?.[index]),
//         date: timestamps?.[index] ?? null,
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
//   console.log("========== SENSOR CHART DEBUG ==========");

//   console.log("OBSERVED DATA:", {
//     valuesLength: values?.length,
//     timestampsLength: timestamps?.length,
//     values,
//     timestamps,
//   });

//   console.log("FORECAST DATA:", {
//     forecastValuesLength: forecastValues?.length,
//     forecastTimestampsLength: forecastTimestamps?.length,
//     forecastValues,
//     forecastTimestamps,
//   });

//   const { observedData, forecastData, hasForecast, maxValue, referenceLines } =
//     useMemo(() => {
//       const observed = buildPoints(values, timestamps);
//       const forecast = buildPoints(forecastValues, forecastTimestamps);

//       const hasForecast = forecast.length > 0;

//       // Keep forecast on the same x-axis timeline as observed data.
//       // Null entries create a gap instead of drawing a line down to zero.
//       const alignedForecast = hasForecast
//         ? [
//             ...observed.map(() => ({
//               value: null,
//               label: "",
//               hideDataPoint: true,
//             })),
//             ...forecast,
//           ]
//         : [];

//       const thresholds = Object.entries(FLOOD_COLORS)
//         .map(([level, color]) => ({
//           level,
//           color,
//           value: toNumber(floodLevels?.[level]),
//         }))
//         .filter((item) => item.value !== null);

//       const allValues = [
//         ...observed.map((point) => point.value),
//         ...forecast.map((point) => point.value),
//         ...thresholds.map((item) => item.value),
//       ];

//       const highest = allValues.length ? Math.max(...allValues) : 1;

//       const lowest = allValues.length ? Math.min(...allValues) : 0;

//       // Avoid clipping thresholds above the observed/forecast values.
//       const maxValue = Math.max(1, highest + Math.abs(highest) * 0.1);

//       const referenceLines = thresholds.map((item) => ({
//         value: item.value,
//         color: item.color,
//         thickness: 2,
//         dashWidth: 0,
//         dashGap: 0,
//       }));

//       const forecastData = forecast.map((point) => ({
//         value: point.value,
//         label: point.label,
//       }));

//       console.log("PROCESSED FORECAST DATA:", {
//         length: forecastData?.length,
//         firstPoint: forecastData?.[0],
//         lastPoint: forecastData?.[forecastData.length - 1],
//         allPoints: forecastData,
//       });

//       console.log("ALIGNED FORECAST DATA:", {
//         length: alignedForecast?.length,
//         firstPoint: alignedForecast?.[0],
//         lastPoint: alignedForecast?.[alignedForecast.length - 1],
//         allPoints: alignedForecast,
//       });

//       console.log("PROCESSED OBSERVED DATA:", {
//         length: observedData?.length,
//         firstPoint: observedData?.[0],
//         lastPoint: observedData?.[observedData.length - 1],
//         allPoints: observedData,
//       });

//       return {
//         observedData: observed.map((point) => ({
//           value: point.value,
//           label: point.label,
//         })),
//         forecastData: alignedForecast,
//         hasForecast,
//         maxValue: Math.max(maxValue, lowest + 1),
//         referenceLines,
//       };
//     }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

//   if (!observedData.length && !hasForecast) {
//     return (
//       <View style={styles.empty}>
//         <Text style={styles.emptyText}>No chart data available</Text>
//       </View>
//     );
//   }

//   const pointCount = Math.max(observedData.length, forecastData.length);

//   const spacing = 45;

//   const chartWidthCalculated = Math.max(chartWidth - 55, pointCount * spacing);

//   return (
//     <View style={[styles.container, { width: chartWidth }]}>
//       <Text style={styles.title}>{title}</Text>

//       <View style={styles.legend}>
//         {observedData.length > 0 && (
//           <View style={styles.legendItem}>
//             <View style={[styles.legendLine, styles.observed]} />
//             <Text style={styles.legendText}>Observed</Text>
//           </View>
//         )}

//         {hasForecast && (
//           <View style={styles.legendItem}>
//             <View style={[styles.legendLine, styles.forecast]} />
//             <Text style={styles.legendText}>Forecast</Text>
//           </View>
//         )}
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator
//         nestedScrollEnabled
//         contentContainerStyle={styles.chartScrollContent}
//       >
//         <LineChart
//           data={observedData}
//           data2={hasForecast ? forecastData : undefined}
//           // interpolateMissingValues={false}
//           strokeDashArray2={[5, 4]}
//           areaChart={false}
//           areaChart2={false}
//           startFillColor="#13118A"
//           endFillColor="#13118A"
//           startOpacity={0.2}
//           endOpacity={0.02}
//           startFillColor2="#36A2EB"
//           endFillColor2="#36A2EB"
//           startOpacity2={0.2}
//           endOpacity2={0.02}
//           color="#13118A"
//           color2="#36A2EB"
//           width={chartWidthCalculated}
//           height={CHART_HEIGHT}
//           spacing={spacing}
//           initialSpacing={10}
//           endSpacing={15}
//           thickness={2}
//           thickness2={2}
//           hideDataPoints
//           hideRules={false}
//           rulesColor="#DDDDDD"
//           yAxisTextStyle={styles.axisText}
//           xAxisLabelTextStyle={styles.axisText}
//           xAxisLabelsHeight={35}
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
//     marginBottom: 8,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   legendLine: {
//     width: 20,
//     height: 3,
//     marginRight: 6,
//     borderRadius: 2,
//   },
//   observed: {
//     backgroundColor: "#13118A",
//   },
//   forecast: {
//     backgroundColor: "#36A2EB",
//   },
//   legendText: {
//     fontSize: 11,
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
//   chartScrollContent: {
//     paddingRight: 16,
//   },
// });

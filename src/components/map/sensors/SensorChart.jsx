import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MAX_POINTS = 120;
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

  const pointCount = Math.max(observedData.length, forecastData.length);

  const spacing = 45;

  const chartWidthCalculated = Math.max(chartWidth - 55, pointCount * spacing);

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
          data={observedData}
          data2={hasForecast ? forecastData : undefined}
          areaChart
          areaChart2={hasForecast}
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

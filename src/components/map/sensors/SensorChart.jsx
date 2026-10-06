import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildPoints(values = [], timestamps = []) {
  return values
    .map((value, index) => {
      const numericValue = toNumber(value);

      if (numericValue === null) {
        return null;
      }

      const timestamp = timestamps[index];

      return {
        value: numericValue,
        date: timestamp ? new Date(timestamp) : null,
      };
    })
    .filter(Boolean);
}

function formatDate(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function SensorChart({
  title,
  values = [],
  timestamps = [],
  forecastValues = [],
  forecastTimestamps = [],
  yAxisLabel,
  floodLevels,
}) {
  const { historicalData, forecastData, maxValue } = useMemo(() => {
    const historical = buildPoints(values, timestamps);
    const forecast = buildPoints(forecastValues, forecastTimestamps);

    const historicalChart = historical.map((point) => ({
      value: point.value,
      label: formatDate(point.date),
      dataPointText: "",
    }));

    const forecastChart = forecast.map((point) => ({
      value: point.value,
      label: formatDate(point.date),
      dataPointText: "",
    }));

    const allValues = [
      ...historical.map((item) => item.value),
      ...forecast.map((item) => item.value),
      ...Object.values(floodLevels || {})
        .map(toNumber)
        .filter(Boolean),
    ];

    const max = allValues.length ? Math.max(...allValues) : 10;

    return {
      historicalData: historicalChart,
      forecastData: forecastChart,
      maxValue: max,
    };
  }, [values, timestamps, forecastValues, forecastTimestamps, floodLevels]);

  if (!historicalData.length && !forecastData.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  /*
   * Keep forecast aligned after the historical data.
   * This reproduces the web implementation where the
   * forecast dataset is preceded by null values.
   */
  const forecastWithGap = [
    ...historicalData.map(() => ({
      value: 0,
      hideDataPoint: true,
      hideLabel: true,
    })),
    ...forecastData,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, styles.observed]} />
          <Text style={styles.legendText}>Observed</Text>
        </View>

        {forecastData.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.forecast]} />
            <Text style={styles.legendText}>Forecast</Text>
          </View>
        )}
      </View>

      <LineChart
        data={historicalData}
        data2={forecastData.length ? forecastWithGap : undefined}
        height={220}
        spacing={45}
        initialSpacing={10}
        endSpacing={10}
        thickness={2}
        thickness2={2}
        curved
        curvature={0.15}
        areaChart
        areaChart2={forecastData.length > 0}
        startFillColor="rgba(19,17,138,0.20)"
        endFillColor="rgba(19,17,138,0.02)"
        startFillColor2="rgba(54,162,235,0.20)"
        endFillColor2="rgba(54,162,235,0.02)"
        color="#13118A"
        color2="#36A2EB"
        hideDataPoints
        hideRules={false}
        rulesColor="#dddddd"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        yAxisLabelSuffix={yAxisLabel}
        maxValue={maxValue * 1.1}
        noOfSections={5}
        isAnimated={false}
        pointerConfig={{
          pointerStripHeight: 180,
          pointerStripColor: "#999",
          pointerColor: "#333",
          radius: 5,
          pointerLabelWidth: 120,
          pointerLabelHeight: 60,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items) => {
            const item = items?.[0];

            return (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipValue}>{item?.value ?? "N/A"}</Text>

                {item?.label ? (
                  <Text style={styles.tooltipDate}>{item.label}</Text>
                ) : null}
              </View>
            );
          },
        }}
      />

      {floodLevels && <FloodLevelLegend floodLevels={floodLevels} />}
    </View>
  );
}

function FloodLevelLegend({ floodLevels }) {
  const levels = [
    {
      name: "Action",
      value: floodLevels.action,
      color: "#EBD700",
    },
    {
      name: "Minor",
      value: floodLevels.minor,
      color: "#FFA500",
    },
    {
      name: "Moderate",
      value: floodLevels.moderate,
      color: "#E10000",
    },
    {
      name: "Major",
      value: floodLevels.major,
      color: "#800080",
    },
  ];

  return (
    <View style={styles.floodContainer}>
      {levels.map((level) => {
        if (level.value === null || level.value === undefined) {
          return null;
        }

        return (
          <View key={level.name} style={styles.floodItem}>
            <View
              style={[styles.floodLine, { backgroundColor: level.color }]}
            />

            <Text style={styles.floodText}>
              {level.name}: {level.value} ft
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  legend: {
    flexDirection: "row",
    marginBottom: 8,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },

  legendLine: {
    width: 22,
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
    fontSize: 12,
    color: "#555",
  },

  axisText: {
    fontSize: 10,
    color: "#666",
  },

  tooltip: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 4,
  },

  tooltipValue: {
    fontSize: 12,
    fontWeight: "700",
  },

  tooltipDate: {
    fontSize: 10,
    color: "#666",
  },

  floodContainer: {
    marginTop: 10,
  },

  floodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  floodLine: {
    width: 22,
    height: 2,
    marginRight: 7,
  },

  floodText: {
    fontSize: 11,
    color: "#555",
  },

  empty: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#777",
  },
});

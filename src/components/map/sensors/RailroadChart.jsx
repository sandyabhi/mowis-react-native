import { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatTime(date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function RailroadChart({ railroad, forecastData, range }) {
  const chartData = useMemo(() => {
    if (!forecastData?.tsp || !forecastData?.flow) {
      return [];
    }

    const now = Date.now();

    const points = forecastData.tsp
      .map((timestamp, index) => ({
        timestamp: new Date(timestamp),
        value: Number(forecastData.flow[index]),
      }))
      .filter(
        (point) =>
          Number.isFinite(point.value) && point.timestamp.getTime() >= now,
      );

    if (!points.length) {
      return [];
    }

    // SHORT RANGE:
    // Keep every hourly point.
    // MEDIUM/LONG:
    // Reduce points for performance.
    const displayedPoints =
      range === "short" ? points : reducePoints(points, 60);

    return displayedPoints.map((point, index) => {
      const previousPoint = displayedPoints[index - 1];

      const isNewDay =
        index === 0 ||
        point.timestamp.getDate() !== previousPoint?.timestamp.getDate() ||
        point.timestamp.getMonth() !== previousPoint?.timestamp.getMonth() ||
        point.timestamp.getFullYear() !==
          previousPoint?.timestamp.getFullYear();

      let label = "";

      // ================================
      // SHORT RANGE
      // ================================
      if (range === "short") {
        const time = formatTime(point.timestamp);

        const dateLabel = point.timestamp.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (isNewDay) {
          label = `${dateLabel}\n${time}`;
        } else {
          label = time;
        }
      }

      // ================================
      // MEDIUM + LONG RANGE
      // ================================
      else {
        if (isNewDay) {
          label = point.timestamp.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }
      }

      return {
        value: point.value,
        label,
      };
    });
  }, [forecastData, range]);

  const CHART_WIDTH = SCREEN_WIDTH - 70;

  const spacing = Math.max(5, CHART_WIDTH / chartData.length);

  if (!chartData.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>
          Forecast data currently unavailable from NOAA for this location.
        </Text>
      </View>
    );
  }

  function reducePoints(points, maxPoints = 120) {
    if (points.length <= maxPoints) {
      return points;
    }

    const step = Math.ceil(points.length / maxPoints);

    const reduced = [];

    for (let i = 0; i < points.length; i += step) {
      reduced.push(points[i]);
    }

    // Always include the final point
    if (reduced[reduced.length - 1] !== points[points.length - 1]) {
      reduced.push(points[points.length - 1]);
    }

    return reduced;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Forecast Streamflow</Text>

      {/* <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 40}
        height={300}
        areaChart
        curved
        spacing={range === "short" ? 35 : 35}
        initialSpacing={10}
        endSpacing={10}
        thickness={2}
        hideDataPoints
        xAxisLabelTextStyle={{
          fontSize: 9,
          color: "#666",
          textAlign: "center",
        }}
        yAxisLabelWidth={45}
        xAxisThickness={1}
        yAxisThickness={1}
        rulesType="solid"
        rulesColor="#E5E5E5"
        noOfSections={5}
      /> */}

      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 40}
        height={300}
        areaChart
        curved
        // initialSpacing={30}
        // endSpacing={20}
        // spacing={45}
        spacing={range === "short" ? 45 : 35}
        thickness={2}
        // hideDataPoints={true}
        dataPointsRadius={2}
        startFillColor="rgb(12, 163, 244)"
        endFillColor="rgba(89, 184, 244, 0.02)"
        startOpacity={0.9}
        endOpacity={0.2}
        yAxisLabelSuffix=""
        yAxisTextStyle={{
          fontSize: 11,
          color: "#666",
        }}
        xAxisLabelTextStyle={{
          fontSize: 10,
          color: "#666",
          textAlign: "center",
        }}
        yAxisLabelWidth={45}
        xAxisThickness={1}
        yAxisThickness={1}
        rulesType="solid"
        rulesColor="#E5E5E5"
        noOfSections={5}
      />

      <Text style={styles.yAxisTitle}>Streamflow (cfs)</Text>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },

  yAxisTitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 13,
    color: "#555",
  },

  noData: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    padding: 20,
  },

  noDataText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
};

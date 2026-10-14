import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import SensorChart from "@/components/map/sensors/SensorChart";

function formatNumber(value, unit = "") {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const number = Number(value);
  return Number.isFinite(number)
    ? `${number.toFixed(2)}${unit}`
    : `${value}${unit}`;
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function SensorDetailsModal({ sensor, onClose }) {
  const [activeTab, setActiveTab] = useState("gauge");
  const [streamflowRange, setStreamflowRange] = useState("short");
  const { width: screenWidth } = useWindowDimensions();

  if (!sensor) return null;

  const measurements = sensor.measurements ?? {};
  const gaugeData = measurements.gh ?? [];
  const gaugeTimestamps = measurements.tsp ?? [];
  const streamflowData = measurements.sf ?? [];
  const streamflowTimestamps = measurements.tspsf ?? [];

  const forecastGauge = measurements.forecast?.gh ?? {};
  const forecastStreamflow =
    measurements.forecast?.sf?.[`${streamflowRange}_range`] ?? {};

  const cardWidth = Math.min(screenWidth - 24, 360);

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {sensor.siteName || "Streamflow Sensor"}
          </Text>
          <Text style={styles.sensorId}>USGS-{sensor.sensorId || "N/A"}</Text>
        </View>

        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <InfoRow
        label="Last Gauge Height"
        value={formatNumber(sensor.gaugeHeight, " ft")}
      />

      {sensor.streamflow && (
        <InfoRow
          label="Last Streamflow"
          value={formatNumber(sensor.streamflow, " ft³/s")}
        />
      )}

      {/* <InfoRow label="Flood Category" value={sensor.floodCategory || "None"} /> */}
      <InfoRow label="Last Reported" value={formatDate(sensor.timestamp)} />

      <View style={styles.tabs}>
        <Tab
          title="Gauge Height"
          active={activeTab === "gauge"}
          onPress={() => setActiveTab("gauge")}
        />

        {streamflowData.length > 0 && (
          <Tab
            title="Streamflow"
            active={activeTab === "streamflow"}
            onPress={() => setActiveTab("streamflow")}
          />
        )}
      </View>

      <ScrollView
        style={styles.chartScroll}
        contentContainerStyle={styles.chartContent}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      >
        {activeTab === "gauge" && (
          <SensorChart
            title="Gauge Height"
            values={sensor.measurements?.gh ?? []}
            timestamps={sensor.measurements?.tsp ?? []}
            forecastValues={sensor.measurements?.forecast?.gh?.height ?? []}
            forecastTimestamps={sensor.measurements?.forecast?.gh?.tsp ?? []}
            yAxisLabel=" ft"
            floodLevels={sensor.flood_levels}
          />
        )}

        {streamflowData.length > 0 && activeTab === "streamflow" && (
          <>
            <View style={styles.rangeTabs}>
              {["short", "medium", "long"].map((range) => (
                <RangeButton
                  key={range}
                  title={range[0].toUpperCase() + range.slice(1)}
                  active={streamflowRange === range}
                  onPress={() => setStreamflowRange(range)}
                />
              ))}
            </View>

            <SensorChart
              title={`Streamflow - ${
                streamflowRange[0].toUpperCase() + streamflowRange.slice(1)
              } Range`}
              values={streamflowData}
              timestamps={streamflowTimestamps}
              forecastValues={forecastStreamflow.flow ?? []}
              forecastTimestamps={forecastStreamflow.tsp ?? []}
              yAxisLabel=" ft³/s"
              chartWidth={cardWidth - 32}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Tab({ title, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.activeTab]}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {title}
      </Text>
    </Pressable>
  );
}

function RangeButton({ title, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.rangeButton, active && styles.activeRangeButton]}
    >
      <Text style={[styles.rangeText, active && styles.activeRangeText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 105,
    right: 12,
    maxHeight: 430,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },
  sensorId: {
    marginTop: 3,
    fontSize: 11,
    color: "#777777",
  },
  close: {
    fontSize: 25,
    lineHeight: 26,
    color: "#444444",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 7,
  },
  label: {
    flex: 1,
    fontSize: 11,
    color: "#666666",
  },
  value: {
    flex: 1.3,
    fontSize: 11,
    fontWeight: "600",
    color: "#222222",
    textAlign: "right",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#EEF4FF",
    borderRadius: 7,
    marginTop: 5,
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginRight: 4,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#155EEF",
  },
  tabText: {
    fontSize: 11,
    color: "#444444",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chartScroll: {
    flexShrink: 1,
  },
  chartContent: {
    paddingBottom: 4,
  },
  rangeTabs: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rangeButton: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#EEEEEE",
    marginRight: 5,
  },
  activeRangeButton: {
    backgroundColor: "#155EEF",
  },
  rangeText: {
    fontSize: 10,
    color: "#555555",
  },
  activeRangeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

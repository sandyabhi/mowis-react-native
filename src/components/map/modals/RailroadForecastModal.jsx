import { useMemo, useState } from "react";

import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RailroadChart from "@/components/map/sensors/RailroadChart";

export default function RailroadForecastModal({ visible, railroad, onClose }) {
  const [range, setRange] = useState("short");

  const forecastData = useMemo(() => {
    if (!railroad?.forecast) return null;

    switch (range) {
      case "medium":
        return railroad.forecast.medium_range;

      case "long":
        return railroad.forecast.long_range;

      case "short":
      default:
        return railroad.forecast.short_range;
    }
  }, [railroad, range]);

  if (!railroad) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {railroad.site_name ?? "Railroad Forecast"}
            </Text>

            <Text style={styles.reachId}>
              Reach ID: {railroad.reach_id ?? "N/A"}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>

        {/* FORECAST SELECTOR */}
        <View style={styles.selector}>
          <Text style={styles.forecastLabel}>Forecast:</Text>

          <TouchableOpacity
            onPress={() => setRange("short")}
            style={styles.option}
          >
            <Text>{range === "short" ? "◉" : "○"} Short</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRange("medium")}
            style={styles.option}
          >
            <Text>{range === "medium" ? "◉" : "○"} Medium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRange("long")}
            style={styles.option}
          >
            <Text>{range === "long" ? "◉" : "○"} Long</Text>
          </TouchableOpacity>
        </View>

        {/* RAILROAD CHART */}
        <View style={styles.chartSection}>
          {forecastData ? (
            // <RailroadChart
            //   railroad={railroad}
            //   forecastData={forecastData}
            //   range={range}
            // />

            <View style={styles.chartSection}>
              <RailroadChart
                railroad={railroad}
                forecastData={forecastData}
                range={range}
              />
            </View>
          ) : (
            <View style={styles.noData}>
              <Text>No forecast data available.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  headerText: {
    flex: 1,
    marginRight: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0057B8",
  },

  reachId: {
    fontSize: 16,
    marginTop: 6,
  },

  close: {
    fontSize: 32,
    color: "#777",
  },

  selector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#EAF3FF",
    marginBottom: 20,
  },

  forecastLabel: {
    fontWeight: "700",
    marginRight: 15,
  },

  option: {
    marginRight: 18,
  },

  chartSection: {
    flex: 1,
  },

  noData: {
    padding: 30,
    alignItems: "center",
  },
});

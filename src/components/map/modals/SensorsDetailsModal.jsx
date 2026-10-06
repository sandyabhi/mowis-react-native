import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SensorChart from "@/components/map/sensors/SensorChart";

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toFixed(2);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export default function SensorDetailsModal({ sensor, onClose }) {
  const [activeTab, setActiveTab] = useState("gauge");
  const [streamflowRange, setStreamflowRange] = useState("short");

  if (!sensor) {
    return null;
  }

  const measurements = sensor.measurements || {};

  const gaugeData = measurements.gh || [];
  const gaugeTimestamps = measurements.tsp || [];

  const streamflowData = measurements.sf || [];
  const streamflowTimestamps = measurements.tspsf || [];

  const forecastGauge = measurements.forecast?.gh || {};

  const forecastStreamflow = measurements.forecast?.sf || {};

  const forecast = forecastStreamflow[`${streamflowRange}_range`] || {
    flow: [],
    tsp: [],
  };

  return (
    <Modal
      visible={!!sensor}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={2}>
                {sensor.siteName || "Streamflow Sensor"}
              </Text>

              <Text style={styles.sensorId}>
                USGS-{sensor.sensorId || "N/A"}
              </Text>
            </View>

            <Pressable onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <View style={styles.summary}>
            <Info
              label="Gauge Height"
              value={`${formatNumber(sensor.gaugeHeight)} ft`}
            />

            <Info
              label="Streamflow"
              value={`${formatNumber(sensor.streamflow)} ft³/s`}
            />

            <Info
              label="Flood Category"
              value={sensor.floodCategory || "None"}
            />

            <Info label="Last Reported" value={formatDate(sensor.timestamp)} />
          </View>

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

          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === "gauge" && (
              <SensorChart
                title="Gauge Height"
                values={gaugeData}
                timestamps={gaugeTimestamps}
                forecastValues={forecastGauge.height || []}
                forecastTimestamps={forecastGauge.tsp || []}
                yAxisLabel=" ft"
                floodLevels={sensor.floodLevels}
              />
            )}

            {activeTab === "streamflow" && (
              <>
                <View style={styles.rangeTabs}>
                  <RangeButton
                    title="Short"
                    active={streamflowRange === "short"}
                    onPress={() => setStreamflowRange("short")}
                  />

                  <RangeButton
                    title="Medium"
                    active={streamflowRange === "medium"}
                    onPress={() => setStreamflowRange("medium")}
                  />

                  <RangeButton
                    title="Long"
                    active={streamflowRange === "long"}
                    onPress={() => setStreamflowRange("long")}
                  />
                </View>

                <SensorChart
                  title={`Streamflow - ${
                    streamflowRange[0].toUpperCase() + streamflowRange.slice(1)
                  } Range`}
                  values={streamflowData}
                  timestamps={streamflowTimestamps}
                  forecastValues={forecast.flow || []}
                  forecastTimestamps={forecast.tsp || []}
                  yAxisLabel=" ft³/s"
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  card: {
    maxHeight: "90%",
    backgroundColor: "white",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerText: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
  },

  sensorId: {
    marginTop: 3,
    fontSize: 12,
    color: "#777",
  },

  close: {
    fontSize: 30,
    lineHeight: 30,
  },

  summary: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },

  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  infoLabel: {
    color: "#666",
    fontSize: 13,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  tab: {
    paddingVertical: 11,
    marginRight: 24,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#13118A",
  },

  tabText: {
    fontSize: 14,
    color: "#777",
  },

  activeTabText: {
    color: "#13118A",
    fontWeight: "700",
  },

  rangeTabs: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 4,
  },

  rangeButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: "#eee",
    marginRight: 7,
  },

  activeRangeButton: {
    backgroundColor: "#13118A",
  },

  rangeText: {
    fontSize: 12,
    color: "#555",
  },

  activeRangeText: {
    color: "white",
    fontWeight: "600",
  },
});

// import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

// function formatNumber(value) {
//   if (value === null || value === undefined) {
//     return "N/A";
//   }

//   const number = Number(value);

//   if (Number.isNaN(number)) {
//     return String(value);
//   }

//   return number.toFixed(2);
// }

// function formatDate(value) {
//   if (!value) {
//     return "N/A";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return String(value);
//   }

//   return date.toLocaleString();
// }

// export default function SensorDetailsModal({ sensor, onClose }) {
//   return (
//     <Modal
//       visible={!!sensor}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.card}>
//           <View style={styles.header}>
//             <Text style={styles.title} numberOfLines={2}>
//               {sensor?.siteName || "Streamflow Sensor"}
//             </Text>

//             <Pressable onPress={onClose}>
//               <Text style={styles.close}>×</Text>
//             </Pressable>
//           </View>

//           <Text style={styles.row}>Sensor ID: {sensor?.sensorId || "N/A"}</Text>

//           <Text style={styles.row}>
//             Streamflow: {formatNumber(sensor?.streamflow)} ft³/s
//           </Text>

//           <Text style={styles.row}>
//             Gauge Height: {formatNumber(sensor?.gaugeHeight)} ft
//           </Text>

//           <Text style={styles.row}>
//             Flood Category: {sensor?.floodCategory || "None"}
//           </Text>

//           <Text style={styles.row}>
//             Last Reported: {formatDate(sensor?.timestamp)}
//           </Text>

//           <Text style={styles.coordinates}>
//             {sensor?.latitude}, {sensor?.longitude}
//           </Text>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,

//     justifyContent: "flex-end",

//     backgroundColor: "rgba(0,0,0,0.25)",
//   },

//   card: {
//     backgroundColor: "white",

//     padding: 20,

//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//   },

//   header: {
//     flexDirection: "row",

//     justifyContent: "space-between",

//     marginBottom: 15,
//   },

//   title: {
//     flex: 1,

//     fontSize: 18,
//     fontWeight: "700",

//     marginRight: 10,
//   },

//   close: {
//     fontSize: 30,
//   },

//   row: {
//     fontSize: 15,
//     marginBottom: 8,
//   },

//   coordinates: {
//     marginTop: 6,

//     fontSize: 12,
//     color: "#777",
//   },
// });

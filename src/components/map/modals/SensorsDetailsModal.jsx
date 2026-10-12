import { Pressable, StyleSheet, Text, View } from "react-native";

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
  if (!sensor) return null;

  return (
    <View style={styles.card}>
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
        label="Gauge Height"
        value={formatNumber(sensor.gaugeHeight, " ft")}
      />

      <InfoRow
        label="Streamflow"
        value={formatNumber(sensor.streamflow, " ft³/s")}
      />

      <InfoRow label="Flood Category" value={sensor.floodCategory || "None"} />

      <InfoRow label="Last Reported" value={formatDate(sensor.timestamp)} />

      <InfoRow label="Latitude" value={formatNumber(sensor.latitude)} />

      <InfoRow label="Longitude" value={formatNumber(sensor.longitude)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 110,
    right: 12,
    width: 310,
    maxWidth: "88%",
    backgroundColor: "#FFFFFF",
    padding: 14,
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
    marginRight: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  sensorId: {
    marginTop: 4,
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
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 11,
    gap: 12,
  },

  label: {
    flex: 1,
    fontSize: 12,
    color: "#666666",
  },

  value: {
    flex: 1.3,
    fontSize: 12,
    fontWeight: "600",
    color: "#222222",
    textAlign: "right",
  },
});

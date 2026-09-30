import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
            <Text style={styles.title} numberOfLines={2}>
              {sensor?.siteName || "Streamflow Sensor"}
            </Text>

            <Pressable onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <Text style={styles.row}>Sensor ID: {sensor?.sensorId || "N/A"}</Text>

          <Text style={styles.row}>
            Streamflow: {formatNumber(sensor?.streamflow)} ft³/s
          </Text>

          <Text style={styles.row}>
            Gauge Height: {formatNumber(sensor?.gaugeHeight)} ft
          </Text>

          <Text style={styles.row}>
            Flood Category: {sensor?.floodCategory || "None"}
          </Text>

          <Text style={styles.row}>
            Last Reported: {formatDate(sensor?.timestamp)}
          </Text>

          <Text style={styles.coordinates}>
            {sensor?.latitude}, {sensor?.longitude}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(0,0,0,0.25)",
  },

  card: {
    backgroundColor: "white",

    padding: 20,

    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 15,
  },

  title: {
    flex: 1,

    fontSize: 18,
    fontWeight: "700",

    marginRight: 10,
  },

  close: {
    fontSize: 30,
  },

  row: {
    fontSize: 15,
    marginBottom: 8,
  },

  coordinates: {
    marginTop: 6,

    fontSize: 12,
    color: "#777",
  },
});

import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

function formatToChicagoTime(dateString) {
  if (!dateString) return "N/A";

  const safeString = String(dateString).replace(" UTC", "Z").replace(" ", "T");

  const date = new Date(safeString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStreamflow(value) {
  if (value == null) return "N/A";

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toFixed(3);
}

export default function FloodDetailsModal({ flood, onClose }) {
  if (!flood) return null;

  const properties = flood.properties || {};

  return (
    <Modal
      visible={!!flood}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Flood Information</Text>

            <Pressable onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Streamflow</Text>
            <Text style={styles.value}>
              {formatStreamflow(properties.streamflow_cfs)} cfs
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Reference Time</Text>
            <Text style={styles.value}>
              {formatToChicagoTime(properties.reference_time)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Updated</Text>
            <Text style={styles.value}>
              {formatToChicagoTime(properties.update_time)}
            </Text>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
  },

  close: {
    fontSize: 30,
    color: "#666",
    lineHeight: 30,
  },

  row: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginBottom: 3,
  },

  value: {
    fontSize: 15,
    fontWeight: "500",
  },

  closeButton: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});

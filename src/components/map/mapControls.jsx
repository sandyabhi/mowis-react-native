import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MapControls({
  showSensors,
  showWeather,
  showDrought,

  onToggleSensors,
  onToggleWeather,
  onToggleDrought,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, showSensors && styles.activeButton]}
        onPress={onToggleSensors}
      >
        <Text style={styles.text}>Sensors</Text>
      </Pressable>

      <Pressable
        style={[styles.button, showWeather && styles.activeButton]}
        onPress={onToggleWeather}
      >
        <Text style={styles.text}>Weather</Text>
      </Pressable>

      <Pressable
        style={[styles.button, showDrought && styles.activeButton]}
        onPress={onToggleDrought}
      >
        <Text style={styles.text}>Drought</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    right: 12,
    gap: 8,
  },

  button: {
    backgroundColor: "white",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 8,

    elevation: 4,
  },

  activeButton: {
    backgroundColor: "#dceeff",
  },

  text: {
    fontWeight: "600",
    color: "#222",
  },
});

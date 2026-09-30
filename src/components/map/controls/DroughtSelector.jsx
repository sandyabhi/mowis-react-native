import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useMap } from "../context/MapContext";

const OPTIONS = [
  {
    label: "Current",
    value: "Current",
  },
  {
    label: "Daily",
    value: "Daily",
  },
  {
    label: "Cumulative",
    value: "Cumulative",
  },
];

export default function DroughtSelector() {
  const { weatherType, setWeatherType } = useMap();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => setOpen((value) => !value)}
      >
        <Text style={styles.buttonText}>🌧️ {weatherType}</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          {OPTIONS.map((option) => {
            const selected = weatherType === option.value;

            return (
              <Pressable
                key={option.value}
                style={[styles.option, selected && styles.selectedOption]}
                onPress={() => {
                  setWeatherType(option.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[styles.optionText, selected && styles.selectedText]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "flex-end",
  },

  button: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  menu: {
    position: "absolute",
    top: 48,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    minWidth: 140,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  selectedOption: {
    backgroundColor: "#e8f3ff",
  },

  optionText: {
    fontSize: 14,
  },

  selectedText: {
    fontWeight: "600",
  },
});

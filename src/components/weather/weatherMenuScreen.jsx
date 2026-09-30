import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MowisMap from "@/components/map/mowisMap";

const WEATHER_OPTIONS = [
  { label: "Current", value: "Current" },
  { label: "Daily", value: "Daily" },
  { label: "Cumulative", value: "Cumulative" },
];

export default function WeatherMapScreen() {
  const [weatherType, setWeatherType] = useState("Current");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MowisMap
        showWeather={true}
        weatherType={weatherType}
        weatherFrame={72}
      />

      {/* Sticky top-right weather selector */}
      <View style={styles.stickyContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setMenuOpen((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.mainButtonText}>🌧️ {weatherType}</Text>
        </TouchableOpacity>

        {menuOpen && (
          <View style={styles.dropdownMenu}>
            {WEATHER_OPTIONS.map((option) => {
              const selected = weatherType === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    selected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setWeatherType(option.value);
                    setMenuOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  stickyContainer: {
    position: "absolute",
    top: 50,
    right: 16,

    zIndex: 1000,
    elevation: 1000,

    alignItems: "flex-end",
  },

  mainButton: {
    backgroundColor: "#007AFF",

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderRadius: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    elevation: 5,
  },

  mainButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },

  dropdownMenu: {
    marginTop: 8,

    backgroundColor: "#FFF",
    borderRadius: 8,

    width: 140,

    paddingVertical: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 5,
  },

  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  selectedOption: {
    backgroundColor: "#F0F8FF",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
  },

  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "700",
  },
});

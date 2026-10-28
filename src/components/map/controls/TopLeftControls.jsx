import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMap } from "../context/MapContext";

const NETWORK_OPTIONS = [
  { id: "streamflow", label: "USGS/USACE-Streamflow" },
  { id: "stageonly", label: "USGS/USACE-Stage Only" },
  { id: "mohic", label: "MoHIC-Stage Only" },
];

const ALL_NETWORK_IDS = NETWORK_OPTIONS.map((network) => network.id);

export default function TopLeftControls({ onSensorSearch }) {
  const [open, setOpen] = useState(false);

  // Streams menu state
  const [showForecastPoints, setShowForecastPoints] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);

  // const [selectedNetworks, setSelectedNetworks] = useState([]);

  function toggleNetwork(id) {
    setSelectedNetworks((current) =>
      current.includes(id)
        ? current.filter((network) => network !== id)
        : [...current, id],
    );
  }

  const {
    activeLayer,
    floodType,
    setFloodType,
    weatherType,
    setWeatherType,
    droughtImageNumber,
    setDroughtImageNumber,
    selectedNetworks,
    setSelectedNetworks,
  } = useMap();

  function toggleNetwork(id) {
    setSelectedNetworks((current) =>
      current.includes(id)
        ? current.filter((network) => network !== id)
        : [...current, id],
    );
  }

  function toggleAllNetworks() {
    const allSelected = ALL_NETWORK_IDS.every((id) =>
      selectedNetworks.includes(id),
    );

    setSelectedNetworks(allSelected ? [] : [...ALL_NETWORK_IDS]);
    setShowNetworks(!allSelected);
  }

  function renderOptions() {
    if (activeLayer === "streams") {
      return (
        <View style={styles.streamsMenu}>
          {/* <CheckboxOption
            label="NWS Daily Forecast Points (USGS + NWS)"
            selected={showForecastPoints}
            onPress={() => setShowForecastPoints((current) => !current)}
          /> */}

          <CheckboxOption
            label="NWS Daily Forecast Points (USGS + NWS)"
            selected={selectedNetworks.includes("nws-forecast")}
            onPress={() => toggleNetwork("nws-forecast")}
          />

          <CheckboxOption
            label="Networks"
            selected={ALL_NETWORK_IDS.every((id) =>
              selectedNetworks.includes(id),
            )}
            onPress={toggleAllNetworks}
          />

          <View style={styles.networkGroup}>
            {NETWORK_OPTIONS.map((network) => (
              <CheckboxOption
                key={network.id}
                label={network.label}
                selected={selectedNetworks.includes(network.id)}
                onPress={() => toggleNetwork(network.id)}
                nested
              />
            ))}
          </View>
        </View>
      );
    }

    if (activeLayer === "flood") {
      return (
        <>
          <Text style={styles.title}>Flood</Text>

          <Option
            label="Current Flood"
            selected={floodType === "current-flood"}
            onPress={() => {
              setFloodType("current-flood");
              setOpen(false);
            }}
          />

          <Option
            label="5-Day Max"
            selected={floodType === "5daymax"}
            onPress={() => {
              setFloodType("5daymax");
              setOpen(false);
            }}
          />
        </>
      );
    }

    if (activeLayer === "weather") {
      return (
        <>
          <Text style={styles.title}>Weather</Text>

          {["Current", "Daily", "Cumulative"].map((type) => (
            <Option
              key={type}
              label={type}
              selected={weatherType === type}
              onPress={() => {
                setWeatherType(type);
                setOpen(false);
              }}
            />
          ))}
        </>
      );
    }

    if (activeLayer === "drought") {
      return (
        <>
          <Text style={styles.title}>Drought</Text>

          <Option
            label="Drought Map"
            selected={droughtImageNumber === 1}
            onPress={() => {
              setDroughtImageNumber(1);
              setOpen(false);
            }}
          />
        </>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.menuButton}
        onPress={() => setOpen((current) => !current)}
      >
        <Text style={styles.menuIcon}>{open ? "✕" : "☰"}</Text>
      </Pressable>

      {open && (
        <View
          style={[
            styles.menu,
            activeLayer === "streams" && styles.streamsMenuContainer,
          ]}
        >
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {renderOptions()}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function CheckboxOption({ label, selected, onPress, nested = false }) {
  return (
    <Pressable
      style={[styles.checkboxOption, nested && styles.nestedOption]}
      onPress={onPress}
    >
      <View style={[styles.checkbox, selected && styles.checkedBox]}>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

function Option({ label, selected, onPress }) {
  return (
    <Pressable
      style={[styles.option, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    left: 15,
    zIndex: 100,
  },

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  menuIcon: {
    fontSize: 24,
    color: "#333",
  },

  menu: {
    position: "absolute",
    top: 55,
    left: 0,
    width: 210,
    maxHeight: 420,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  streamsMenuContainer: {
    width: 390,
    maxHeight: 500,
  },

  streamsMenu: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },

  checkboxOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 2,
  },

  nestedOption: {
    paddingLeft: 25,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#777",
    marginRight: 12,
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  checkedBox: {
    backgroundColor: "#1976D2",
    borderColor: "#1976D2",
  },

  checkmark: {
    color: "white",
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "bold",
  },

  checkboxLabel: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: "#333",
  },

  networkGroup: {
    paddingLeft: 2,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  selectedOption: {
    backgroundColor: "#e8f3ff",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
  },

  selectedText: {
    fontWeight: "600",
    color: "#007AFF",
  },
});

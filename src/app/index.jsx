import { useEffect, useState } from "react";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import SensorDetailsModal from "@/components/map/layers/sensorsDetailsModal";
import MapControls from "@/components/map/mapControls";
import MowisMap from "@/components/map/mowisMap";

import { fetchStreamflowData } from "@/services/streamflowService";

import { streamflowToGeoJSON } from "@/utils/streamflowGeoJson";

export default function MapScreen() {
  const [sensorGeoJSON, setSensorGeoJSON] = useState(null);

  const [loadingSensors, setLoadingSensors] = useState(true);

  const [sensorError, setSensorError] = useState(null);

  const [showSensors, setShowSensors] = useState(true);

  const [showWeather, setShowWeather] = useState(false);

  const [showDrought, setShowDrought] = useState(false);

  const [selectedSensor, setSelectedSensor] = useState(null);

  const [weatherFrame, setWeatherFrame] = useState(72);

  const [droughtImageNumber, setDroughtImageNumber] = useState(1);

  // ----------------------------------------
  // LOAD SENSOR DATA
  // ----------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadSensors() {
      try {
        setLoadingSensors(true);

        const data = await fetchStreamflowData();

        const geoJSON = streamflowToGeoJSON(data);

        if (!cancelled) {
          setSensorGeoJSON(geoJSON);

          console.log("Sensors:", geoJSON.features.length);
        }
      } catch (error) {
        console.error("Sensor loading error:", error);

        if (!cancelled) {
          setSensorError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingSensors(false);
        }
      }
    }

    loadSensors();

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------
  // WEATHER ANIMATION
  // ----------------------------------------

  useEffect(() => {
    if (!showWeather) {
      return;
    }

    const interval = setInterval(() => {
      setWeatherFrame((current) => {
        if (current >= 72) {
          return 1;
        }

        return current + 1;
      });
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [showWeather]);

  // ----------------------------------------
  // SENSOR CLICK
  // ----------------------------------------

  function handleSensorPress(event) {
    const features = event?.nativeEvent?.features;

    if (!features?.length) {
      return;
    }

    setSelectedSensor(features[0].properties);
  }

  return (
    <View style={styles.container}>
      <MowisMap
        sensorGeoJSON={sensorGeoJSON}
        showSensors={showSensors}
        showWeather={showWeather}
        showDrought={showDrought}
        weatherFrame={weatherFrame}
        droughtImageNumber={droughtImageNumber}
        onSensorPress={handleSensorPress}
      />

      <MapControls
        showSensors={showSensors}
        showWeather={showWeather}
        showDrought={showDrought}
        onToggleSensors={() => setShowSensors((value) => !value)}
        onToggleWeather={() => setShowWeather((value) => !value)}
        onToggleDrought={() => setShowDrought((value) => !value)}
      />

      {loadingSensors && (
        <View style={styles.loading}>
          <ActivityIndicator />

          <Text style={styles.loadingText}>Loading sensors...</Text>
        </View>
      )}

      {sensorError && (
        <View style={styles.error}>
          <Text>Failed to load sensors</Text>

          <Text>{sensorError}</Text>
        </View>
      )}

      <SensorDetailsModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loading: {
    position: "absolute",

    top: 55,
    left: 12,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "white",

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderRadius: 8,

    elevation: 4,
  },

  loadingText: {
    marginLeft: 8,
  },

  error: {
    position: "absolute",

    bottom: 30,
    left: 12,
    right: 12,

    backgroundColor: "#ffeeee",

    padding: 12,

    borderRadius: 8,
  },
});

// import MapScreen from "@/components/map/MapApp";
// import { View } from "react-native";

// export default function HomeScreen() {
//   return (
//     <View style={{ flex: 1 }}>
//       <MapScreen />
//     </View>
//   );
// }

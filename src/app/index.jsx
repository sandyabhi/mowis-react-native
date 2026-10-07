import { useEffect, useState } from "react";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import MowisMap from "@/components/map/MowisMap";

import DroughtCalendar from "@/components/drought/DroughtCalendar";
import BottomNavigation from "@/components/map/controls/BottomNavigation";
import CumulativeWeatherControls from "@/components/map/controls/CummulativeWeatherControls";
import CurrentWeatherControls from "@/components/map/controls/CurrentWeatherControls";
import DailyWeatherControls from "@/components/map/controls/DailyWeatherControls";
import TopLeftControls from "@/components/map/controls/TopLeftControls";
import FloodDetailsModal from "@/components/map/modals/FloodDetailsModal";
import SensorDetailsModal from "@/components/map/modals/SensorsDetailsModal";

import { fetchStreamflowData } from "@/services/streamflowService";

import { streamflowToGeoJSON } from "@/utils/streamflowGeoJson";

import { useMap } from "@/components/map/context/MapContext";

import { fetchFloodGeoJSON } from "@/services/floodService";
import { fetchRailroadData } from "@/services/railroadService";

export default function MapScreen() {
  const [sensorGeoJSON, setSensorGeoJSON] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);

  const [loadingSensors, setLoadingSensors] = useState(true);
  const [sensorError, setSensorError] = useState(null);

  const [selectedFlood, setSelectedFlood] = useState(null);
  console.log("selected flood polygon", selectedFlood);

  const {
    showWeather,
    setWeatherFrame,
    activeLayer,
    weatherFrame,
    weatherType,

    droughtImageNumber,
    setDroughtImageNumber,
    selectedDroughtDate,
    setSelectedDroughtDate,
    showDroughtCalendar,
    setShowDroughtCalendar,

    floodType,
    setFloodGeoJSON,
    setFloodLoading,
    setFloodError,

    railroadData,
    setRailroadData,
    railroadNetworkGeoJSON,
    setRailroadNetworkGeoJSON,
    railroadLoading,
    setRailroadLoading,
    railroadError,
    setRailroadError,
  } = useMap();

  const [selectedRailroad, setSelectedRailroad] = useState(null);
  useEffect(() => {
    if (activeLayer !== "railroad") {
      return;
    }

    let cancelled = false;

    async function loadRailroad() {
      try {
        setRailroadLoading(true);
        setRailroadError(null);

        const forecastData = await fetchRailroadData();

        if (cancelled) return;

        setRailroadData(forecastData);
        // setRailroadNetworkGeoJSON(networkData);
      } catch (error) {
        if (!cancelled) {
          console.error("Railroad loading error:", error);
          setRailroadError(error.message);
        }
      } finally {
        if (!cancelled) {
          setRailroadLoading(false);
        }
      }
    }

    loadRailroad();

    return () => {
      cancelled = true;
    };
  }, [
    activeLayer,
    setRailroadData,
    setRailroadNetworkGeoJSON,
    setRailroadLoading,
    setRailroadError,
  ]);

  function handleRailroadPress(event) {
    const features = event?.nativeEvent?.features;

    if (!features?.length) {
      return;
    }

    setSelectedRailroad(features[0].properties);
  }

  useEffect(() => {
    if (activeLayer !== "flood") {
      return;
    }

    let cancelled = false;

    async function loadFlood() {
      try {
        setFloodLoading(true);
        setFloodError(null);

        const geoJSON = await fetchFloodGeoJSON(floodType);

        if (cancelled) {
          return;
        }

        setFloodGeoJSON(geoJSON);
      } catch (error) {
        if (!cancelled) {
          console.error("Flood data error:", error);
          setFloodError(error.message);
        }
      } finally {
        if (!cancelled) {
          setFloodLoading(false);
        }
      }
    }

    loadFlood();

    return () => {
      cancelled = true;
    };
  }, [activeLayer, floodType, setFloodGeoJSON, setFloodLoading, setFloodError]);

  function handleFloodPress(event) {
    console.log("FLOOD LAYER PRESSED:", event);

    const features = event?.nativeEvent?.features;

    if (!features?.length) {
      console.log("No flood feature");
      return;
    }

    console.log("Selected flood:", features[0]);

    setSelectedFlood(features[0]);
  }

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

  // // Weather animation
  // useEffect(() => {
  //   if (!showWeather) {
  //     return;
  //   }

  //   const interval = setInterval(() => {
  //     setWeatherFrame((current) => {
  //       return current >= 72 ? 1 : current + 1;
  //     });
  //   }, 200);

  //   return () => clearInterval(interval);
  // }, [showWeather, setWeatherFrame]);

  console.log(activeLayer, "-", showDroughtCalendar);

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
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
      />

      <TopLeftControls />

      {activeLayer === "weather" && weatherType === "Current" && (
        <CurrentWeatherControls />
      )}

      {activeLayer === "weather" && weatherType === "Daily" && (
        <DailyWeatherControls />
      )}

      {activeLayer === "weather" && weatherType === "Cumulative" && (
        <CumulativeWeatherControls />
      )}

      {activeLayer === "drought" && showDroughtCalendar && (
        <DroughtCalendar
          visible={showDroughtCalendar}
          selectedDate={selectedDroughtDate}
          onSelectDate={(date, imageNumber) => {
            setSelectedDroughtDate(date);
            setDroughtImageNumber(imageNumber);
          }}
          onClose={() => setShowDroughtCalendar(false)}
        />
      )}

      {/* <TopRightControls /> */}

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

      <FloodDetailsModal
        flood={selectedFlood}
        onClose={() => setSelectedFlood(null)}
      />

      <BottomNavigation />
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
    bottom: 90,
    left: 12,
    right: 12,
    backgroundColor: "#ffeeee",
    padding: 12,
    borderRadius: 8,
  },
});

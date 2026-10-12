import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
import { fetchSensorGeoJSON } from "@/services/sensorGeoJsonService";

export default function MapScreen() {
  const [sensorBasin, setSensorBasin] = useState(null);
  const [sensorFlowlines, setSensorFlowlines] = useState(null);
  const [geoJSONLoading, setGeoJSONLoading] = useState(false);
  const [geoJSONError, setGeoJSONError] = useState(null);
  const [sensorGeoJSON, setSensorGeoJSON] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showSensorInfo, setShowSensorInfo] = useState(false);
  const [sensorDataById, setSensorDataById] = useState({});

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

        if (cancelled) return;

        setSensorDataById(data);

        const geoJSON = streamflowToGeoJSON(data);
        setSensorGeoJSON(geoJSON);

        console.log("Sensors:", geoJSON.features.length);
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

  const [sensorData, setSensorData] = useState(null);

  function handleSensorPress(event) {
    const feature = event?.features?.[0] ?? event?.nativeEvent?.features?.[0];

    if (!feature) {
      console.log("No sensor feature found:", event);
      return;
    }

    const properties = feature.properties ?? {};
    const sensorId = String(properties.sensorId ?? "");

    if (!sensorId) {
      console.log("Sensor ID missing:", properties);
      return;
    }

    // Recover the original API record, including measurements and forecasts.
    const rawSensor = sensorDataById?.[sensorId];

    if (!rawSensor) {
      console.error("Original sensor record not found:", sensorId);
      console.log(
        "Available sensor IDs:",
        Object.keys(sensorDataById).slice(0, 10),
      );
      return;
    }

    const measurements = rawSensor.measurements ?? {};

    const last = (values) =>
      Array.isArray(values) && values.length > 0
        ? values[values.length - 1]
        : null;

    setSelectedSensor({
      ...rawSensor,
      sensorId,
      siteName:
        rawSensor.site_name ?? properties.siteName ?? `Sensor ${sensorId}`,
      measurements,
      gaugeHeight: last(measurements.gh),
      streamflow: last(measurements.sf),
      timestamp: last(measurements.tsp),
      floodCategory:
        rawSensor.flood_levels?.category ?? properties.floodCategory ?? "None",
      floodLevels: rawSensor.flood_levels ?? {},
    });

    setShowSensorInfo(true);
  }

  useEffect(() => {
    const sensorId = selectedSensor?.sensorId;

    if (!sensorId) {
      setSensorBasin(null);
      setSensorFlowlines(null);
      setGeoJSONError(null);
      return;
    }

    let cancelled = false;

    async function loadSelectedSensorGeoJSON() {
      setGeoJSONLoading(true);
      setGeoJSONError(null);

      try {
        const result = await fetchSensorGeoJSON(sensorId);

        if (cancelled) return;

        setSensorBasin(result.basin);
        setSensorFlowlines(result.flowlines);

        console.log("Basin loaded:", result.basin?.type);
        console.log("Flowlines loaded:", result.flowlines?.type);
      } catch (error) {
        if (!cancelled) {
          setGeoJSONError(error.message);
          console.error("Sensor GeoJSON error:", error);
        }
      } finally {
        if (!cancelled) {
          setGeoJSONLoading(false);
        }
      }
    }

    loadSelectedSensorGeoJSON();

    return () => {
      cancelled = true;
    };
  }, [selectedSensor?.sensorId]);

  // useEffect(() => {
  //   if (!selectedSensor?.sensorId) {
  //     setSensorBasin(null);
  //     setSensorFlowlines(null);
  //     setGeoJSONError(null);
  //     return;
  //   }

  //   let cancelled = false;

  //   async function loadSelectedSensorGeoJSON() {
  //     setGeoJSONLoading(true);
  //     setGeoJSONError(null);
  //     setSensorBasin(null);
  //     setSensorFlowlines(null);

  //     try {
  //       const result = await fetchSensorGeoJSON(selectedSensor.sensorId);

  //       if (cancelled) return;

  //       setSensorBasin(result.basin);
  //       setSensorFlowlines(result.flowlines);
  //     } catch (error) {
  //       if (!cancelled) {
  //         setGeoJSONError(error.message);
  //         console.error("Sensor GeoJSON error:", error);
  //       }
  //     } finally {
  //       if (!cancelled) {
  //         setGeoJSONLoading(false);
  //       }
  //     }
  //   }

  //   loadSelectedSensorGeoJSON();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [selectedSensor?.sensorId]);

  return (
    <View style={styles.container}>
      {/* <MowisMap
        sensorGeoJSON={sensorGeoJSON}
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
      /> */}

      {/* <MowisMap
        sensorGeoJSON={sensorGeoJSON}
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
        sensorBasin={sensorBasin}
        sensorFlowlines={sensorFlowlines}
      /> */}

      <MowisMap
        sensorGeoJSON={sensorGeoJSON}
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
        sensorBasin={sensorBasin}
        sensorFlowlines={sensorFlowlines}
      />

      {/* {selectedSensor && (
        <Pressable
          style={styles.sensorToggleButton}
          onPress={() => setShowSensorInfo((visible) => !visible)}
        >
          <Text style={styles.sensorToggleText}>
            {showSensorInfo ? "Hide Sensor Info ▲" : "Show Sensor Info ▼"}
          </Text>
        </Pressable>
      )} */}

      {selectedSensor && (
        <Pressable
          style={styles.sensorToggleButton}
          onPress={() => setShowSensorInfo((visible) => !visible)}
        >
          <Text style={styles.sensorToggleText}>
            {showSensorInfo ? "Hide Sensor Info ▲" : "Show Sensor Info ▼"}
          </Text>
        </Pressable>
      )}

      {selectedSensor && showSensorInfo && (
        <SensorDetailsModal
          sensor={selectedSensor}
          onClose={() => setShowSensorInfo(false)}
        />
      )}

      {/* 
      <MowisMap
        sensorGeoJSON={sensorGeoJSON}
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
        sensorBasin={sensorBasin}
        sensorFlowlines={sensorFlowlines}
      /> */}
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

      {/* <SensorDetailsModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      /> */}
      {/* {selectedSensor && showSensorInfo && (
        <SensorDetailsModal
          sensor={selectedSensor}
          onClose={() => setShowSensorInfo(false)}
        />
      )} */}

      {/* <SensorDetailsModal
        sensor={showSensorInfo ? sensorData : null}
        onClose={() => setShowSensorInfo(false)}
      /> */}

      {/* <SensorDetailsModal
        sensor={showSensorInfo ? selectedSensor : null}
        onClose={() => setShowSensorInfo(false)}
      /> */}

      {/* <StreamflowLayer
        geoJSON={streamflowGeoJSON}
        onSensorPress={handleSensorPress}
      />

      <SensorDetailsModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      /> */}

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

  sensorToggleButton: {
    position: "absolute",
    bottom: 44,
    alignSelf: "center",
    backgroundColor: "#13118A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 15,
    zIndex: 20,
  },

  sensorToggleText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

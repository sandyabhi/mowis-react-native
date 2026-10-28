import { useEffect, useMemo, useState } from "react";

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
import SensorSearchBar from "@/components/map/controls/SensorSearchBar";
import TopLeftControls from "@/components/map/controls/TopLeftControls";
import FloodDetailsModal from "@/components/map/modals/FloodDetailsModal";
import SensorDetailsModal from "@/components/map/modals/SensorsDetailsModal";
import {
  fetchRelatedSensorData,
  getRelatedSensors,
} from "@/services/relatedSensorService";
import { fetchSelectedNetworkData } from "@/services/streamflowService";

import { relatedSensorsToGeoJSON } from "@/utils/relatedSensorsGeoJson";
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
  const [sensorSearchQuery, setSensorSearchQuery] = useState("");
  const [allSitesMap, setAllSitesMap] = useState({});
  const [relatedSensorsMap, setRelatedSensorsMap] = useState({});
  const [relatedSensors, setRelatedSensors] = useState({});
  const [relatedSensorsError, setRelatedSensorsError] = useState(null);
  const [relatedSensorGeoJSON, setRelatedSensorGeoJSON] = useState(null);
  const [searchedSensorId, setSearchedSensorId] = useState(null);
  const [allSensorsForSearch, setAllSensorsForSearch] = useState([]);

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

    selectedNetworks,
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

  const filteredSensorGeoJSON = useMemo(() => {
    if (!sensorGeoJSON) return null;

    const query = sensorSearchQuery.trim().toLowerCase();

    if (!query) {
      return sensorGeoJSON;
    }

    return {
      ...sensorGeoJSON,
      features: sensorGeoJSON.features.filter((feature) => {
        const properties = feature.properties ?? {};

        const name = String(
          properties.siteName ?? properties.site_name ?? "",
        ).toLowerCase();

        const id = String(properties.sensorId ?? "").toLowerCase();

        return name.includes(query) || id.includes(query);
      }),
    };
  }, [sensorGeoJSON, sensorSearchQuery]);

  // const [centerOnSensor, setCenterOnSensor] = useState(null);
  const [centerOnSensor, setCenterOnSensor] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRelatedSensors() {
      try {
        const { allSitesMap, relatedSensorsMap } =
          await fetchRelatedSensorData();

        if (cancelled) return;

        setAllSitesMap(allSitesMap);
        setRelatedSensorsMap(relatedSensorsMap);

        console.log(
          "Loaded sensor site records:",
          Object.keys(allSitesMap).length,
        );

        console.log(
          "Loaded related sensor mappings:",
          Object.keys(relatedSensorsMap).length,
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Related sensor loading error:", error);
          setRelatedSensorsError(error.message);
        }
      }
    }

    loadRelatedSensors();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeLayer !== "streams") {
      return;
    }

    let cancelled = false;

    async function loadSensors() {
      try {
        setLoadingSensors(true);
        setSensorError(null);

        const networksToLoad =
          selectedNetworks.length === 0 ? ["streamflow"] : selectedNetworks;

        console.log("Networks to load:", networksToLoad);

        const datasets = await fetchSelectedNetworkData(networksToLoad);

        if (cancelled) return;

        const combinedData = {};
        const combinedFeatures = [];

        for (const { networkId, data } of datasets) {
          const geoJSON = streamflowToGeoJSON(data);

          combinedFeatures.push(...geoJSON.features);
          Object.assign(combinedData, data);
        }

        if (cancelled) return;

        setSensorDataById(combinedData);

        setSensorGeoJSON({
          type: "FeatureCollection",
          features: combinedFeatures,
        });

        console.log("Loaded networks:", networksToLoad);
        console.log("Loaded features:", combinedFeatures.length);
      } catch (error) {
        if (!cancelled) {
          console.error("Sensor loading error:", error);
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
  }, [activeLayer, selectedNetworks]);

  return (
    <View style={styles.container}>
      {activeLayer === "streams" && (
        <SensorSearchBar
          sensors={sensorGeoJSON?.features ?? []}
          onSearch={setSensorSearchQuery}
          onSelect={(feature) => {
            const sensorId = String(feature.properties?.sensorId ?? "");

            if (sensorId && Object.keys(allSitesMap).length > 0) {
              const related = getRelatedSensors(
                sensorId,
                allSitesMap,
                relatedSensorsMap,
              );

              const sensorId = String(feature.properties?.sensorId ?? "");

              console.log("Selected sensor ID:", sensorId);
              console.log("ALL sites loaded:", Object.keys(allSitesMap).length);
              console.log(
                "Relationship map loaded:",
                Object.keys(relatedSensorsMap).length,
              );

              console.log("Related sensor count:", Object.keys(related).length);
              console.log(
                "Related sensor sample:",
                Object.entries(related).slice(0, 3),
              );

              setRelatedSensors(related);
              setSearchedSensorId(sensorId);
              setRelatedSensorGeoJSON(
                relatedSensorsToGeoJSON(related, sensorId),
              );

              console.log(
                `Related sensors for ${sensorId}:`,
                Object.keys(related),
              );
            }

            centerOnSensor?.(feature);
            handleSensorPress({ features: [feature] });
          }}
        />
      )}

      <MowisMap
        sensorGeoJSON={
          activeLayer === "streams" ? filteredSensorGeoJSON : sensorGeoJSON
        }
        relatedSensorGeoJSON={relatedSensorGeoJSON}
        onSensorPress={handleSensorPress}
        onFloodPress={handleFloodPress}
        onRailroadPress={handleRailroadPress}
        sensorBasin={sensorBasin}
        sensorFlowlines={sensorFlowlines}
        onCenterOnSensorReady={(fn) => setCenterOnSensor(() => fn)}
      />

      {selectedSensor && (
        <Pressable
          style={styles.sensorToggleButton}
          onPress={() => setShowSensorInfo((visible) => !visible)}
        >
          <Text style={styles.sensorToggleText}>
            {showSensorInfo ? "-" : "+"}
          </Text>
        </Pressable>
      )}

      {selectedSensor && showSensorInfo && (
        <SensorDetailsModal
          sensor={selectedSensor}
          onClose={() => setShowSensorInfo(false)}
        />
      )}

      {/* <TopLeftControls /> */}

      {(activeLayer === "weather" ||
        activeLayer === "flood" ||
        activeLayer === "streams" ||
        activeLayer === "railroad") && <TopLeftControls />}

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
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#08067d",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
    zIndex: 20,
  },

  sensorToggleText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "400",
  },
});

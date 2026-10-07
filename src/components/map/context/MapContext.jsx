import { fetchLatestWeatherTime } from "@/services/weatherService";
import { createContext, useContext, useEffect, useState } from "react";

const MapContext = createContext(null);

export function MapProvider({ children }) {
  const [activeLayer, setActiveLayer] = useState("weather");

  const [showSensors, setShowSensors] = useState(false);

  const [showWeather, setShowWeather] = useState(true);
  const [weatherType, setWeatherType] = useState("Current");
  const [weatherDate, setWeatherDate] = useState(null);
  const [weatherFrame, setWeatherFrame] = useState(72);
  const [latestWeatherDate, setLatestWeatherDate] = useState(null);

  // useEffect(() => {
  //   async function loadLatestWeather() {
  //     try {
  //       const latest = await fetchLatestWeatherTime();

  //       setLatestWeatherDate(latest);
  //       setWeatherFrame(72);
  //     } catch (error) {
  //       console.error("Failed to load latest weather:", error);
  //     }
  //   }

  //   loadLatestWeather();
  // }, []);
  useEffect(() => {
    async function loadLatestWeather() {
      try {
        console.log("Loading latest weather...");

        const latest = await fetchLatestWeatherTime();

        console.log("Setting latestWeatherDate:", latest);
        console.log("Setting weatherFrame: 72");

        setLatestWeatherDate(latest);
        setWeatherFrame(72);
      } catch (error) {
        console.error("Failed to load latest weather:", error);
      }
    }

    loadLatestWeather();
  }, []);

  useEffect(() => {
    setWeatherFrame(weatherType === "Current" ? 72 : 1);
  }, [weatherType]);

  const [showDrought, setShowDrought] = useState(false);
  const [droughtImageNumber, setDroughtImageNumber] = useState(1);
  const [selectedDroughtDate, setSelectedDroughtDate] = useState(null);
  const [showDroughtCalendar, setShowDroughtCalendar] = useState(true);

  const [floodType, setFloodType] = useState("current-flood");
  const [floodGeoJSON, setFloodGeoJSON] = useState(null);
  const [floodLoading, setFloodLoading] = useState(false);
  const [floodError, setFloodError] = useState(null);

  const [railroadData, setRailroadData] = useState(null);
  const [railroadNetworkGeoJSON, setRailroadNetworkGeoJSON] = useState(null);
  const [railroadLoading, setRailroadLoading] = useState(false);
  const [railroadError, setRailroadError] = useState(null);

  return (
    <MapContext.Provider
      value={{
        activeLayer,
        setActiveLayer,

        showSensors,
        setShowSensors,

        showWeather,
        setShowWeather,
        weatherType,
        setWeatherType,
        weatherFrame,
        setWeatherFrame,
        latestWeatherDate,
        setLatestWeatherDate,

        showDrought,
        setShowDrought,
        droughtImageNumber,
        setDroughtImageNumber,
        selectedDroughtDate,
        setSelectedDroughtDate,
        showDroughtCalendar,
        setShowDroughtCalendar,

        floodType,
        setFloodType,
        floodGeoJSON,
        setFloodGeoJSON,
        floodLoading,
        setFloodLoading,
        floodError,
        setFloodError,

        railroadData,
        setRailroadData,
        railroadNetworkGeoJSON,
        setRailroadNetworkGeoJSON,
        railroadLoading,
        setRailroadLoading,
        railroadError,
        setRailroadError,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMap must be used inside MapProvider");
  }

  return context;
}

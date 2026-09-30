import { createContext, useContext, useState } from "react";

const MapContext = createContext(null);

export function MapProvider({ children }) {
  const [activeLayer, setActiveLayer] = useState("weather");

  const [showSensors, setShowSensors] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showDrought, setShowDrought] = useState(false);

  const [weatherType, setWeatherType] = useState("Current");
  const [weatherFrame, setWeatherFrame] = useState(72);

  const [droughtImageNumber, setDroughtImageNumber] = useState(1);

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

        showDrought,
        setShowDrought,

        weatherType,
        setWeatherType,

        weatherFrame,
        setWeatherFrame,

        droughtImageNumber,
        setDroughtImageNumber,

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

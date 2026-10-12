import * as MapLibreGL from "@maplibre/maplibre-react-native";

import { useMap } from "./context/MapContext";
import BaseMapLayer from "./layers/BaseMapLayer";
import DroughtLayer from "./layers/DroughtLayer";
import FloodLayer from "./layers/FloodLayer";
import RailRoadLayer from "./layers/RailRoadLayer";
import SensorGeoJSONLayers from "./layers/SensorGeoJSONLayers";
import StreamflowLayer from "./layers/StreamflowLayer";
import WeatherLayer from "./layers/WeatherLayer";

import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from "@/constants/mapConfig";

export default function MowisMap({
  sensorGeoJSON,
  onSensorPress,
  onFloodPress,
  onRailroadPress,
  sensorBasin,
  sensorFlowlines,
}) {
  const {
    showSensors,
    showWeather,
    showDrought,

    weatherFrame,
    weatherType,

    droughtImageNumber,

    floodGeoJSON,

    railroadData,
    railroadNetworkGeoJSON,

    activeLayer,
  } = useMap();

  console.log("MOWIS MPA Scree", showWeather, weatherType, weatherFrame);
  console.log("MOWIS COORD", INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);

  return (
    <MapLibreGL.Map
      style={{ flex: 1 }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      <MapLibreGL.Camera
        initialViewState={{
          center: INITIAL_MAP_CENTER,
          zoom: INITIAL_MAP_ZOOM,
        }}
      />

      <BaseMapLayer />

      {/* 
      <WeatherLayer
        visible={activeLayer === "weather"}
        frame={weatherFrame}
        type={weatherType}
      /> 
      */}
      <WeatherLayer
        visible={activeLayer === "weather"}
        type={weatherType}
        frame={weatherFrame}
      />

      <DroughtLayer
        visible={activeLayer === "drought"}
        imageNumber={droughtImageNumber}
      />

      <RailRoadLayer
        visible={activeLayer === "railroad"}
        railroadData={railroadData}
        onMarkerPress={onRailroadPress}
      />

      <FloodLayer
        visible={activeLayer === "flood"}
        geoJSON={floodGeoJSON}
        onFloodPress={onFloodPress}
      />

      {/* <SensorGeoJSONLayers basin={sensorBasin} flowlines={sensorFlowlines} /> */}
      <SensorGeoJSONLayers basin={sensorBasin} flowlines={sensorFlowlines} />

      {activeLayer === "streams" && (
        <StreamflowLayer
          geoJSON={sensorGeoJSON}
          onSensorPress={onSensorPress}
        />
      )}
      {/* 
      <WeatherLayer
        visible={showWeather}
        frame={weatherFrame}
        type={weatherType}
      />

      <DroughtLayer visible={showDrought} imageNumber={droughtImageNumber} />

      <FloodLayer visible={activeLayer === "flood"} geoJSON={floodGeoJSON} />

      {showSensors && (
        <StreamflowLayer
          geoJSON={sensorGeoJSON}
          onSensorPress={onSensorPress}
        />
      )} */}
    </MapLibreGL.Map>
  );
}

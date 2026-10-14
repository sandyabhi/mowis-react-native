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
import { useCallback, useEffect, useState } from "react";

export default function MowisMap({
  sensorGeoJSON,
  onSensorPress,
  onFloodPress,
  onRailroadPress,
  sensorBasin,
  sensorFlowlines,
  onCenterOnSensorReady,
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

  const [cameraTarget, setCameraTarget] = useState({
    centerCoordinate: INITIAL_MAP_CENTER,
    zoomLevel: INITIAL_MAP_ZOOM,
  });

  const centerOnSensor = useCallback((feature) => {
    console.log("========== SENSOR SELECTED ==========");
    console.log("Full feature:", JSON.stringify(feature, null, 2));

    const coordinates = feature?.geometry?.coordinates;

    console.log("Raw coordinates:", coordinates);
    console.log("Coordinate type:", typeof coordinates);
    console.log("Longitude:", coordinates?.[0]);
    console.log("Latitude:", coordinates?.[1]);

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2 ||
      !Number.isFinite(Number(coordinates[0])) ||
      !Number.isFinite(Number(coordinates[1]))
    ) {
      console.warn("Invalid sensor coordinates:", coordinates);
      return;
    }

    const nextTarget = {
      centerCoordinate: [Number(coordinates[0]), Number(coordinates[1])],
      zoomLevel: 12,
    };

    console.log("Setting camera target:", nextTarget);

    setCameraTarget(nextTarget);
  }, []);

  useEffect(() => {
    console.log("Camera target state updated:", cameraTarget);
  }, [cameraTarget]);

  useEffect(() => {
    console.log("Initial map center:", INITIAL_MAP_CENTER);
    console.log("Initial map zoom:", INITIAL_MAP_ZOOM);
  }, []);

  useEffect(() => {
    onCenterOnSensorReady?.(centerOnSensor);
  }, [centerOnSensor, onCenterOnSensorReady]);

  console.log("=====================");
  console.log("=====================");
  console.log(
    "INITIAL MAP CENTER",
    INITIAL_MAP_CENTER,
    INITIAL_MAP_ZOOM,
    cameraTarget.centerCoordinate,
    cameraTarget.zoomLevel,
  );
  console.log(cameraTarget, ">>>>>>>>>>>>>>>>");

  console.log("=====================");
  console.log("=====================");

  return (
    // <MapLibreGL.Map
    //   ref={cameraRef}
    //   centerCoordinate={cameraTarget.centerCoordinate}
    //   zoomLevel={cameraTarget.zoomLevel}
    //   animationDuration={800}
    //   style={{ flex: 1 }}
    //   mapStyle="https://demotiles.maplibre.org/style.json"
    // >
    //   <MapLibreGL.Camera
    //     centerCoordinate={cameraTarget.centerCoordinate}
    //     zoomLevel={cameraTarget.zoomLevel}
    //     animationDuration={800}
    //   />
    <MapLibreGL.Map
      style={{ flex: 1 }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      {/* <MapLibreGL.Camera
        initialViewState={{
          center: INITIAL_MAP_CENTER,
          zoom: INITIAL_MAP_ZOOM,
        }}
      /> */}

      <MapLibreGL.Camera
        initialViewState={{
          center: INITIAL_MAP_CENTER,
          zoom: INITIAL_MAP_ZOOM,
        }}
        center={cameraTarget.centerCoordinate}
        zoom={cameraTarget.zoomLevel}
        // trackUserLocation={cameraTarget.centerCoordinate}

        // centerCoordinate={cameraTarget.centerCoordinate}
        // zoomLevel={cameraTarget.zoomLevel}
        animationDuration={800}
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

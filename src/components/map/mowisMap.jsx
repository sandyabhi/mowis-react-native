import * as MapLibreGL from "@maplibre/maplibre-react-native";

import { useMap } from "./context/MapContext";
import BaseMapLayer from "./layers/BaseMapLayer";
import DroughtLayer from "./layers/DroughtLayer";
import FloodLayer from "./layers/FloodLayer";
import MissouriBoundaryLayer from "./layers/MissouriBoundaryLayer";
import OutsideSquareMaskLayer from "./layers/OutsideSquareMaskLayer";
import RailRoadLayer from "./layers/RailRoadLayer";
import RiverNetworkLayer from "./layers/RiverNetworkLayer";
import SensorGeoJSONLayers from "./layers/SensorGeoJSONLayers";
import StreamflowLayer from "./layers/StreamflowLayer";
import WeatherLayer from "./layers/WeatherLayer";

import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from "@/constants/mapConfig";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MowisMap({
  sensorGeoJSON,
  relatedSensorGeoJSON,
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

    showWaterwayCrossings,
    showRailroads,

    activeLayer,
  } = useMap();

  console.log("MOWIS MPA Scree", showWeather, weatherType, weatherFrame);
  console.log("MOWIS COORD", INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);

  const [cameraTarget, setCameraTarget] = useState({
    centerCoordinate: INITIAL_MAP_CENTER,
    zoomLevel: INITIAL_MAP_ZOOM,
  });

  const mapRef = useRef(null);

  const centerOnSensor = useCallback((feature) => {
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

  const handleMapPress = async (event) => {
    if (activeLayer !== "flood") {
      return;
    }

    try {
      console.log("========== MAP PRESSED ==========");
      console.log("Event:", event);

      const point = event?.point || event?.nativeEvent?.point;

      if (!point) {
        console.log("No press point found");
        return;
      }

      console.log("Press point:", point);

      const features = await mapRef.current?.queryRenderedFeatures(point, {
        layers: ["flood-fill-layer"],
      });

      console.log("Queried flood features:", features);

      if (!Array.isArray(features) || features.length === 0) {
        console.log("No flood polygon pressed");
        return;
      }

      const floodFeature = features[0];

      if (floodFeature?.type !== "Feature" || !floodFeature?.properties) {
        console.log("Invalid flood feature");
        return;
      }

      console.log("Flood polygon pressed:", floodFeature);

      onFloodPress?.(floodFeature);
    } catch (error) {
      console.error("Error querying flood feature:", error);
    }
  };

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
      ref={mapRef}
      style={{ flex: 1 }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      onPress={handleMapPress}
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

      <MissouriBoundaryLayer />

      <RiverNetworkLayer />

      <OutsideSquareMaskLayer />

      <DroughtLayer
        visible={activeLayer === "drought"}
        imageNumber={droughtImageNumber}
      />

      <RailRoadLayer
        visible={activeLayer === "railroad"}
        showWaterwayCrossings={showWaterwayCrossings}
        showRailroads={showRailroads}
        railroadData={railroadData}
        railroadNetworkGeoJSON={railroadNetworkGeoJSON}
        onMarkerPress={onRailroadPress}
      />

      <FloodLayer visible={activeLayer === "flood"} geoJSON={floodGeoJSON} />

      {/* <SensorGeoJSONLayers basin={sensorBasin} flowlines={sensorFlowlines} /> */}
      <SensorGeoJSONLayers basin={sensorBasin} flowlines={sensorFlowlines} />

      {/* {activeLayer === "streams" && (
        <StreamflowLayer
          geoJSON={sensorGeoJSON}
          onSensorPress={onSensorPress}
        />
      )}

      {relatedSensorGeoJSON?.features?.length > 0 && (
        <StreamflowLayer
          geoJSON={relatedSensorGeoJSON}
          onSensorPress={onSensorPress}
        />
      )} */}

      {activeLayer === "streams" && (
        <StreamflowLayer
          geoJSON={sensorGeoJSON}
          onSensorPress={onSensorPress}
          idPrefix="streamflow"
        />
      )}

      {activeLayer === "streams" &&
        relatedSensorGeoJSON?.features?.length > 0 && (
          <StreamflowLayer
            geoJSON={relatedSensorGeoJSON}
            onSensorPress={onSensorPress}
            idPrefix="related-streamflow"
            related
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

import * as MapLibreGL from "@maplibre/maplibre-react-native";

import BaseMapLayer from "./layers/baseMapLayer";
import DroughtLayer from "./layers/droughtLayer";
import StreamflowLayer from "./layers/streamflowLayer";

import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from "@/constants/mapConfig";

export default function MowisMap({
  sensorGeoJSON,

  showSensors,
  showWeather,
  showDrought,

  weatherFrame,
  droughtImageNumber,

  onSensorPress,
}) {
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
      <WeatherLayer visible={showWeather} frame={weatherFrame} /> */}

      <DroughtLayer visible={showDrought} imageNumber={droughtImageNumber} />

      {showSensors && (
        <StreamflowLayer
          geoJSON={sensorGeoJSON}
          onSensorPress={onSensorPress}
        />
      )}
    </MapLibreGL.Map>
  );
}

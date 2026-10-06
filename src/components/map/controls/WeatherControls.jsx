import { useMap } from "../context/MapContext";

export default function WeatherControls() {
  const { weatherType, weatherFrame, setWeatherType, setWeatherFrame } =
    useMap();

  return (
    <View style={styles.container}>
      <WeatherSelector />

      <WeatherCalendar
        type={weatherType}
        selectedIndex={weatherFrame}
        onSelect={setWeatherFrame}
      />

      <SevenSegmentTime date={selectedWeatherDate} />
    </View>
  );
}

import { StyleSheet, View } from "react-native";

import WeatherSelector from "./WeatherSelector";

export default function TopRightControls() {
  return (
    <View style={styles.container}>
      <WeatherSelector />
      {/* <DroughtSelector /> */}

      {/* Future controls */}

      {/* <LocationButton /> */}
      {/* <LegendButton /> */}
      {/* <MapSettingsButton /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 55,
    right: 12,

    zIndex: 1000,
    elevation: 1000,
  },
});

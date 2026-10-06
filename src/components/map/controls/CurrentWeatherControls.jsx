import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  CURRENT_FRAME_COUNT,
  getCurrentFrameDate,
} from "@/utils/weatherFrames";

import { useMap } from "../context/MapContext";

const PLAY_INTERVAL = 200;

export default function CurrentWeatherControls() {
  const { weatherFrame, setWeatherFrame, latestWeatherDate } = useMap();

  const [isPlaying, setIsPlaying] = useState(false);

  const intervalRef = useRef(null);

  const selectedDate = getCurrentFrameDate(latestWeatherDate, weatherFrame);

  function goPrevious() {
    setWeatherFrame((current) => {
      const nextFrame = current <= 1 ? CURRENT_FRAME_COUNT : current - 1;

      console.log("Previous frame:", current, "→", nextFrame);

      return nextFrame;
    });
  }

  function goNext() {
    setWeatherFrame((current) => {
      const nextFrame = current >= CURRENT_FRAME_COUNT ? 1 : current + 1;

      console.log("Next frame:", current, "→", nextFrame);

      return nextFrame;
    });
  }

  function goNow() {
    console.log("Now:", weatherFrame, "→", CURRENT_FRAME_COUNT);

    setWeatherFrame(CURRENT_FRAME_COUNT);
  }

  function togglePlay() {
    if (isPlaying) {
      console.log("PAUSE");

      clearInterval(intervalRef.current);
      intervalRef.current = null;

      setIsPlaying(false);

      return;
    }

    console.log("PLAY starting from frame:", weatherFrame);

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setWeatherFrame((current) => {
        const nextFrame = current >= CURRENT_FRAME_COUNT ? 1 : current + 1;

        console.log("Playing:", current, "→", nextFrame);

        return nextFrame;
      });
    }, PLAY_INTERVAL);
  }

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  console.log("CurrentWeatherControls:", {
    weatherFrame,
    latestWeatherDate,
    selectedDate,
    isPlaying,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(selectedDate)}</Text>

      <Text style={styles.date}>{formatDate(selectedDate)}</Text>

      <View style={styles.controls}>
        <ControlButton label="◀" onPress={goPrevious} />

        <ControlButton
          label={isPlaying ? "Pause" : "Play"}
          onPress={togglePlay}
          width={76}
        />

        <ControlButton label="▶" onPress={goNext} />

        <ControlButton label="Now" onPress={goNow} width={70} />
      </View>
    </View>
  );
}

function ControlButton({ label, onPress, width = 58 }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, { width }]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function formatTime(date) {
  if (!date) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date) {
  if (!date) {
    return "Loading...";
  }

  return date.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 85,
    left: 15,
    right: 15,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 100,
  },

  time: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },

  date: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginTop: 4,
    marginBottom: 12,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  button: {
    height: 42,
    borderRadius: 7,
    backgroundColor: "#0756B5",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

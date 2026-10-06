import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMap } from "../context/MapContext";

const CUMULATIVE_IMAGE_COUNT = 14;
const PLAY_INTERVAL = 700;

const CummulativeWeatherControls = () => {
  const { latestWeatherDate, setWeatherFrame } = useMap();

  const [cumulativeFrame, setCumulativeFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollRef = useRef(null);
  const playIntervalRef = useRef(null);

  const latestCumulativeDate = useMemo(() => {
    if (!latestWeatherDate) {
      return null;
    }

    const latest = new Date(latestWeatherDate);

    const centralDateString = latest.toLocaleDateString("en-US", {
      timeZone: "America/Chicago",
    });

    const [month, day, year] = centralDateString.split("/").map(Number);

    const yesterday = new Date(year, month - 1, day);

    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday;
  }, [latestWeatherDate]);

  const availableDates = useMemo(() => {
    if (!latestCumulativeDate) {
      return [];
    }

    const dates = [];

    for (let frame = 1; frame <= CUMULATIVE_IMAGE_COUNT; frame++) {
      const date = new Date(latestCumulativeDate);

      date.setDate(date.getDate() - (frame - 1));

      dates.push({
        date,
        frame,
      });
    }

    return dates.reverse();
  }, [latestCumulativeDate]);

  useEffect(() => {
    if (!latestCumulativeDate) {
      return;
    }

    setCumulativeFrame(1);
    setWeatherFrame(1);
  }, [latestCumulativeDate, setWeatherFrame]);

  function selectDate(frame, shouldScroll = true) {
    setCumulativeFrame(frame);
    setWeatherFrame(frame);

    if (shouldScroll) {
      scrollToFrame(frame);
    }
  }

  function scrollToFrame(frame) {
    const index = availableDates.findIndex((item) => item.frame === frame);

    if (index === -1) {
      return;
    }

    const ITEM_WIDTH = 78;

    const screenOffset = Math.max(0, index * ITEM_WIDTH - 120);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: screenOffset,
        animated: true,
      });
    });
  }

  function goPrevious() {
    setCumulativeFrame((current) => {
      if (current >= CUMULATIVE_IMAGE_COUNT) {
        return current;
      }

      const nextFrame = current + 1;

      setWeatherFrame(nextFrame);
      scrollToFrame(nextFrame);

      return nextFrame;
    });
  }

  function goNext() {
    setCumulativeFrame((current) => {
      if (current <= 1) {
        return current;
      }

      const nextFrame = current - 1;

      setWeatherFrame(nextFrame);
      scrollToFrame(nextFrame);

      return nextFrame;
    });
  }

  function goNow() {
    selectDate(1);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    });
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlaying();
      return;
    }

    if (cumulativeFrame >= CUMULATIVE_IMAGE_COUNT) {
      setCumulativeFrame(1);
      setWeatherFrame(1);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      });
    }

    setIsPlaying(true);

    playIntervalRef.current = setInterval(() => {
      setCumulativeFrame((current) => {
        if (current >= CUMULATIVE_IMAGE_COUNT) {
          stopPlaying();

          return current;
        }

        const nextFrame = current + 1;

        setWeatherFrame(nextFrame);
        scrollToFrame(nextFrame);

        return nextFrame;
      });
    }, PLAY_INTERVAL);
  }

  function stopPlaying() {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }

    setIsPlaying(false);
  }

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function formatDay(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  function isSelected(frame) {
    return frame <= cumulativeFrame;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={stopPlaying} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      {/* Horizontal date timeline */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScroll}
      >
        {availableDates.map(({ date, frame }) => {
          const selected = isSelected(frame);

          return (
            <Pressable
              key={date.toISOString()}
              onPress={() => selectDate(frame)}
              style={[styles.dateItem, selected && styles.selectedDateItem]}
            >
              <Text style={[styles.dayText, selected && styles.selectedText]}>
                {formatDay(date)}
              </Text>

              <Text style={[styles.dateText, selected && styles.selectedText]}>
                {formatDate(date)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <ControlButton label="◀" onPress={goPrevious} />

        <ControlButton
          label={isPlaying ? "Pause" : "Play"}
          onPress={togglePlay}
          width={72}
        />

        <ControlButton label="▶" onPress={goNext} />

        <ControlButton label="Now" onPress={goNow} width={72} />
      </View>
    </View>
  );
};

function ControlButton({ label, onPress, width = 58 }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width,
        },
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 85,
    left: 8,
    right: 8,

    backgroundColor: "white",

    borderRadius: 10,

    padding: 8,

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

  header: {
    height: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",

    right: 0,
    top: -4,

    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 27,

    lineHeight: 27,

    color: "#111",
  },

  dateScroll: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    gap: 6,
  },

  dateItem: {
    minWidth: 72,
    height: 58,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EEEEEE",

    paddingHorizontal: 8,
  },

  selectedDateItem: {
    backgroundColor: "#0756B5",
  },

  dayText: {
    fontSize: 12,

    fontWeight: "600",

    color: "#555",
  },

  dateText: {
    fontSize: 15,

    fontWeight: "700",

    color: "#111",

    marginTop: 2,
  },

  selectedText: {
    color: "white",
  },

  controls: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginTop: 5,
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

export default CummulativeWeatherControls;

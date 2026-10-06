import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMap } from "../context/MapContext";

const DAILY_IMAGE_COUNT = 14;
const PLAY_INTERVAL = 700;

const DailyWeatherControls = () => {
  const { latestWeatherDate, setWeatherFrame } = useMap();

  const [dailyDate, setDailyDate] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollRef = useRef(null);
  const playIntervalRef = useRef(null);

  const latestDailyDate = useMemo(() => {
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

  useEffect(() => {
    if (!latestDailyDate) {
      return;
    }

    setDailyDate(new Date(latestDailyDate));

    setWeatherFrame(1);
  }, [latestDailyDate, setWeatherFrame]);

  const availableDates = useMemo(() => {
    if (!latestDailyDate) {
      return [];
    }

    const dates = [];

    for (let frame = 1; frame <= DAILY_IMAGE_COUNT; frame++) {
      const date = new Date(latestDailyDate);

      date.setDate(date.getDate() - (frame - 1));

      dates.push({
        date,
        frame,
      });
    }

    return dates.reverse();
  }, [latestDailyDate]);

  function getDailyFrame(date) {
    if (!date || !latestDailyDate) {
      return 1;
    }

    const diff = Math.round(
      (latestDailyDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diff + 1;
  }

  function isSameDate(date1, date2) {
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function selectDate(date, shouldScroll = true) {
    if (!date || !latestDailyDate) {
      return;
    }

    if (date > latestDailyDate) {
      return;
    }

    const frame = getDailyFrame(date);

    if (frame < 1 || frame > DAILY_IMAGE_COUNT) {
      return;
    }

    setDailyDate(new Date(date));
    setWeatherFrame(frame);

    console.log("Daily selected:", {
      date: date.toISOString(),
      frame,
      image: `Daily${frame}.gif`,
    });

    if (shouldScroll) {
      scrollToDate(date);
    }
  }

  function scrollToDate(date) {
    if (!date || !availableDates.length) {
      return;
    }

    const index = availableDates.findIndex((item) =>
      isSameDate(item.date, date),
    );

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
    if (!dailyDate) {
      return;
    }

    const currentFrame = getDailyFrame(dailyDate);

    if (currentFrame >= DAILY_IMAGE_COUNT) {
      return;
    }

    const previousDate = new Date(dailyDate);

    previousDate.setDate(previousDate.getDate() - 1);

    selectDate(previousDate);
  }

  function goNext() {
    if (!dailyDate) {
      return;
    }

    const currentFrame = getDailyFrame(dailyDate);

    // Already at latest.
    if (currentFrame <= 1) {
      return;
    }

    const nextDate = new Date(dailyDate);

    nextDate.setDate(nextDate.getDate() + 1);

    selectDate(nextDate);
  }

  function goLatest() {
    if (!latestDailyDate) {
      return;
    }

    const latest = new Date(latestDailyDate);

    selectDate(latest);

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

    if (!dailyDate) {
      return;
    }

    let startingDate = new Date(dailyDate);

    if (getDailyFrame(startingDate) <= 1) {
      startingDate = new Date(latestDailyDate);

      startingDate.setDate(startingDate.getDate() - (DAILY_IMAGE_COUNT - 1));

      selectDate(startingDate, false);
    }

    setIsPlaying(true);

    playIntervalRef.current = setInterval(() => {
      setDailyDate((currentDate) => {
        if (!currentDate || !latestDailyDate) {
          return currentDate;
        }

        const currentFrame = getDailyFrame(currentDate);

        if (currentFrame <= 1) {
          stopPlaying();

          return currentDate;
        }

        const nextDate = new Date(currentDate);

        nextDate.setDate(nextDate.getDate() + 1);

        const nextFrame = getDailyFrame(nextDate);

        setWeatherFrame(nextFrame);

        scrollToDate(nextDate);

        return nextDate;
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Text style={styles.title}>Daily</Text> */}

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
        {availableDates.map(({ date }) => {
          const selected = isSameDate(date, dailyDate);

          return (
            <Pressable
              key={date.toISOString()}
              onPress={() => selectDate(date)}
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

        <ControlButton label="Now" onPress={goLatest} width={72} />
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

  title: {
    fontSize: 15,

    fontWeight: "700",

    color: "#333",
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

  /*
   * Horizontal date list.
   */
  dateScroll: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    gap: 6,
  },

  /*
   * Individual date.
   */
  dateItem: {
    minWidth: 72,
    height: 58,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EEEEEE",

    paddingHorizontal: 8,
  },

  /*
   * Selected date.
   */
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

  /*
   * Bottom controls.
   */
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

export default DailyWeatherControls;

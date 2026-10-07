import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getDroughtDates } from "@/utils/droughtDates";

const WEEKS_TO_SHOW = 9;

const WEEK_WIDTH = 130;
const WEEK_GAP = 6;
const WEEK_STEP = WEEK_WIDTH + WEEK_GAP;

const PLAY_INTERVAL = 1000;

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getWeekRange(releaseDate) {
  const end = new Date(`${releaseDate}T00:00:00`);

  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return {
    start,
    end,
  };
}

export default function DroughtCalendar({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}) {
  const droughtDates = useMemo(() => getDroughtDates(WEEKS_TO_SHOW), []);

  const scrollRef = useRef(null);
  const playIntervalRef = useRef(null);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const selectedWeekIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  const weeks = droughtDates.map((item, index) => {
    const { start, end } = getWeekRange(item.date);

    return {
      ...item,
      weekNumber: index + 1,
      start,
      end,
    };
  });

  const selectedIndex = weeks.findIndex((week) => week.date === selectedDate);

  const activeIndex = selectedIndex >= 0 ? selectedIndex : selectedWeekIndex;

  function scrollToWeek(index) {
    if (!weeks.length) {
      return;
    }

    const visualIndex = weeks.length - 1 - index;

    const x = Math.max(0, visualIndex * WEEK_STEP);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x,
        animated: true,
      });
    });
  }

  function selectWeek(week, index, shouldScroll = true) {
    if (!week) {
      return;
    }

    selectedWeekIndexRef.current = index;

    setSelectedWeekIndex(index);

    onSelectDate(week.date, week.imageNumber);

    if (shouldScroll) {
      scrollToWeek(index);
    }
  }

  function goToLatest() {
    if (!weeks.length) {
      return;
    }

    stopPlaying();

    selectWeek(weeks[0], 0);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: 0,
        animated: true,
      });
    });
  }

  function goPreviousWeek() {
    if (!weeks.length) {
      return;
    }

    const previousIndex = activeIndex >= weeks.length - 1 ? 0 : activeIndex + 1;

    selectWeek(weeks[previousIndex], previousIndex);
  }

  function goNextWeek() {
    if (!weeks.length) {
      return;
    }

    const nextIndex = activeIndex <= 0 ? weeks.length - 1 : activeIndex - 1;

    selectWeek(weeks[nextIndex], nextIndex);
  }

  function startPlaying() {
    if (!weeks.length) {
      return;
    }

    setIsPlaying(true);

    playIntervalRef.current = setInterval(() => {
      const currentIndex = selectedWeekIndexRef.current;

      const nextIndex = currentIndex >= weeks.length - 1 ? 0 : currentIndex + 1;

      const nextWeek = weeks[nextIndex];

      selectedWeekIndexRef.current = nextIndex;

      setSelectedWeekIndex(nextIndex);

      onSelectDate(nextWeek.date, nextWeek.imageNumber);

      scrollToWeek(nextIndex);
    }, PLAY_INTERVAL);
  }

  function stopPlaying() {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }

    setIsPlaying(false);
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* <Text style={styles.title}>Drought</Text> */}

          {weeks[activeIndex] && (
            <Text style={styles.subtitle}>
              {formatShortDate(weeks[activeIndex].start)}
              {" - "}
              {formatShortDate(weeks[activeIndex].end)}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => {
            stopPlaying();
            onClose();
          }}
          style={styles.closeButton}
        >
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>

      {/* Weekly timeline */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekScroll}
      >
        {[...weeks].reverse().map((week) => {
          const dataIndex = weeks.findIndex((item) => item.date === week.date);

          const selected = dataIndex === activeIndex;

          return (
            <Pressable
              key={week.date}
              onPress={() => selectWeek(week, dataIndex)}
              style={[styles.weekCard, selected && styles.selectedWeekCard]}
            >
              <Text style={[styles.weekLabel, selected && styles.selectedText]}>
                Week {week.weekNumber}
              </Text>

              <Text style={[styles.weekDates, selected && styles.selectedText]}>
                {formatShortDate(week.start)}
                {" - "}
                {formatShortDate(week.end)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={goPreviousWeek}>
          <Text style={styles.controlText}>◀</Text>
        </Pressable>

        <Pressable style={styles.playButton} onPress={togglePlay}>
          <Text style={styles.controlText}>{isPlaying ? "Pause" : "Play"}</Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPress={goNextWeek}>
          <Text style={styles.controlText}>▶</Text>
        </Pressable>

        <Pressable style={styles.latestButton} onPress={goToLatest}>
          <Text style={styles.controlText}>Latest</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 85,
    left: 8,
    right: 8,

    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    padding: 8,

    elevation: 10,

    zIndex: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 4,
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
  },

  closeButton: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",
  },

  close: {
    fontSize: 28,
    lineHeight: 30,
    color: "#111",
  },

  weekScroll: {
    gap: WEEK_GAP,

    paddingHorizontal: 2,
    paddingVertical: 3,
  },

  weekCard: {
    width: WEEK_WIDTH,
    height: 58,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: "#D8D8D8",

    backgroundColor: "#D3D3D3",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 5,
  },

  selectedWeekCard: {
    backgroundColor: "#0756B5",
    borderColor: "#0756B5",
  },

  weekLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  weekDates: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",

    marginTop: 3,
  },

  selectedText: {
    color: "#FFFFFF",
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    marginTop: 7,
  },

  controlButton: {
    flex: 1,

    height: 38,

    backgroundColor: "#0756B5",

    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",
  },

  playButton: {
    flex: 1.3,

    height: 38,

    backgroundColor: "#0756B5",

    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",
  },

  latestButton: {
    flex: 1.3,

    height: 38,

    backgroundColor: "#0756B5",

    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",
  },

  controlText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

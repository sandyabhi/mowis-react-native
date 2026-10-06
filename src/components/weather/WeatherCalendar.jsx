import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WeatherCalendar({ type, selectedIndex, onSelect }) {
  const items = getCalendarItems(type);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === "Current" ? "Rain Rate" : type}
        </Text>
      </View>

      <View style={styles.grid}>
        {items.map((item) => {
          const selected = item.index === selectedIndex;

          return (
            <Pressable
              key={item.index}
              onPress={() => onSelect(item.index)}
              style={[styles.cell, selected && styles.selectedCell]}
            >
              <Text style={[styles.cellText, selected && styles.selectedText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function getCalendarItems(type) {
  if (type === "Current") {
    return Array.from({ length: 72 }, (_, index) => ({
      index: index + 1,
      label: index + 1,
    }));
  }

  if (type === "Daily") {
    return Array.from({ length: 14 }, (_, index) => ({
      index: index + 1,
      label: `Day ${index + 1}`,
    }));
  }

  if (type === "Cumulative") {
    return Array.from({ length: 15 }, (_, index) => ({
      index,
      label: `Day ${index + 1}`,
    }));
  }

  return [];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  header: {
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    marginBottom: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    width: 220,
  },

  cell: {
    width: 30,
    height: 30,
    borderRadius: 6,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#f2f2f2",
  },

  selectedCell: {
    backgroundColor: "#007AFF",
  },

  cellText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },

  selectedText: {
    color: "white",
    fontWeight: "700",
  },
});

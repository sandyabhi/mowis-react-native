import { StyleSheet, Text, View } from "react-native";

export default function SevenSegmentTime({ date }) {
  if (!date) {
    return null;
  }

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const [timePart, period] = time.split(" ");
  const [hour, minute] = timePart.split(":");

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {hour}:{minute}
      </Text>

      <Text style={styles.period}>{period}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  time: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 3,
  },

  period: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },
});

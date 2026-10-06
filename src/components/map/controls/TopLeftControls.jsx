import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useMap } from "../context/MapContext";

export default function TopLeftControls() {
  const [open, setOpen] = useState(false);

  const {
    activeLayer,
    floodType,
    setFloodType,
    weatherType,
    setWeatherType,
    droughtImageNumber,
    setDroughtImageNumber,
  } = useMap();

  function renderOptions() {
    if (activeLayer === "flood") {
      return (
        <>
          <Text style={styles.title}>Flood</Text>

          <Option
            label="Current Flood"
            selected={floodType === "current-flood"}
            onPress={() => {
              setFloodType("current-flood");
              setOpen(false);
            }}
          />

          <Option
            label="5-Day Max"
            selected={floodType === "5daymax"}
            onPress={() => {
              setFloodType("5daymax");
              setOpen(false);
            }}
          />
        </>
      );
    }
    if (activeLayer === "weather") {
      return (
        <>
          <Text style={styles.title}>Weather</Text>

          <Option
            label="Current"
            selected={weatherType === "Current"}
            onPress={() => {
              setWeatherType("Current");
              setOpen(false);
            }}
          />

          <Option
            label="Daily"
            selected={weatherType === "Daily"}
            onPress={() => {
              setWeatherType("Daily");
              setOpen(false);
            }}
          />

          <Option
            label="Cumulative"
            selected={weatherType === "Cumulative"}
            onPress={() => {
              setWeatherType("Cumulative");
              setOpen(false);
            }}
          />
        </>
      );
    }

    // {
    //   activeLayer === "weather" && weatherType === "Current" && (
    //     <CurrentWeatherControls />
    //   );
    // }

    // {
    //   activeLayer === "weather" && weatherType === "Daily" && (
    //     <DailyWeatherControls />
    //   );
    // }

    // {
    //   activeLayer === "weather" && weatherType === "Cumulative" && (
    //     <CumulativeWeatherControls />
    //   );
    // }

    // if (activeLayer === "weather") {
    //   return (
    //     <>
    //       <Text style={styles.title}>Weather</Text>

    //       <Option
    //         label="Current"
    //         selected={weatherType === "Current"}
    //         onPress={() => setWeatherType("Current")}
    //       />

    //       <Option
    //         label="Daily"
    //         selected={weatherType === "Daily"}
    //         onPress={() => setWeatherType("Daily")}
    //       />

    //       <Option
    //         label="Cumulative"
    //         selected={weatherType === "Cumulative"}
    //         onPress={() => setWeatherType("Cumulative")}
    //       />
    //     </>
    //   );
    // }

    if (activeLayer === "drought") {
      return (
        <>
          <Text style={styles.title}>Drought</Text>

          <Option
            label="Drought Map"
            selected={droughtImageNumber === 1}
            onPress={() => {
              setDroughtImageNumber(1);
              setOpen(false);
            }}
          />
        </>
      );
    }

    if (activeLayer === "streams") {
      return (
        <>
          <Text style={styles.title}>Streams</Text>

          <Option label="Streamflow" selected onPress={() => setOpen(false)} />
        </>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.menuButton}
        onPress={() => setOpen((value) => !value)}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      {open && <View style={styles.menu}>{renderOptions()}</View>}
    </View>
  );
}

function Option({ label, selected, onPress }) {
  return (
    <Pressable
      style={[styles.option, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    left: 15,
    zIndex: 100,
  },

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  menuIcon: {
    fontSize: 24,
  },

  menu: {
    position: "absolute",
    top: 55,
    left: 0,

    width: 190,

    backgroundColor: "white",
    borderRadius: 12,

    paddingVertical: 6,

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  selectedOption: {
    backgroundColor: "#e8f3ff",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
  },

  selectedText: {
    fontWeight: "600",
    color: "#007AFF",
  },
});

// import { useState } from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { useMap } from "../context/MapContext";
// // import WeatherControls from "./WeatherControls";

// export default function TopLeftControls() {
//   const [open, setOpen] = useState(false);

//   const {
//     activeLayer,

//     floodType,
//     setFloodType,

//     weatherType,
//     setWeatherType,

//     droughtImageNumber,
//     setDroughtImageNumber,
//   } = useMap();

//   function renderOptions() {
//     if (activeLayer === "flood") {
//       return (
//         <>
//           <Text style={styles.title}>Flood</Text>

//           <Option
//             label="Current Flood"
//             selected={floodType === "current-flood"}
//             onPress={() => {
//               setFloodType("current-flood");
//               setOpen(false);
//             }}
//           />

//           <Option
//             label="5-Day Max"
//             selected={floodType === "5daymax"}
//             onPress={() => {
//               setFloodType("5daymax");
//               setOpen(false);
//             }}
//           />
//         </>
//       );
//     }

//     {
//       activeLayer === "weather" && ((<WeatherControls />), console.log("HH"));
//     }

//     // if (activeLayer === "weather") {
//     //   return (
//     //     <>
//     //       <Text style={styles.title}>Weather</Text>

//     //       <Option
//     //         label="Current"
//     //         selected={weatherType === "Current"}
//     //         onPress={() => {
//     //           setWeatherType("Current");
//     //           setOpen(false);
//     //         }}
//     //       />

//     //       <Option
//     //         label="Daily"
//     //         selected={weatherType === "Daily"}
//     //         onPress={() => {
//     //           setWeatherType("Daily");
//     //           setOpen(false);
//     //         }}
//     //       />

//     //       <Option
//     //         label="Cumulative"
//     //         selected={weatherType === "Cumulative"}
//     //         onPress={() => {
//     //           setWeatherType("Cumulative");
//     //           setOpen(false);
//     //         }}
//     //       />
//     //     </>
//     //   );
//     // }

//     if (activeLayer === "drought") {
//       return (
//         <>
//           <Text style={styles.title}>Drought</Text>

//           <Option
//             label="Drought Map"
//             selected={droughtImageNumber === 1}
//             onPress={() => {
//               setDroughtImageNumber(1);
//               setOpen(false);
//             }}
//           />
//         </>
//       );
//     }

//     if (activeLayer === "streams") {
//       return (
//         <>
//           <Text style={styles.title}>Streams</Text>

//           <Option label="Streamflow" selected onPress={() => setOpen(false)} />
//         </>
//       );
//     }

//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       <Pressable
//         style={styles.menuButton}
//         onPress={() => setOpen((value) => !value)}
//       >
//         <Text style={styles.menuIcon}>☰</Text>
//       </Pressable>

//       {open && <View style={styles.menu}>{renderOptions()}</View>}
//     </View>
//   );
// }

// function Option({ label, selected, onPress }) {
//   return (
//     <Pressable
//       style={[styles.option, selected && styles.selectedOption]}
//       onPress={onPress}
//     >
//       <Text style={[styles.optionText, selected && styles.selectedText]}>
//         {label}
//       </Text>
//     </Pressable>
//   );
// }

// function WeatherControls() {
//   const { weatherType, weatherFrame, setWeatherType, setWeatherFrame } =
//     useMap();

//   return (
//     <View style={styles.container}>
//       <WeatherSelector />

//       <WeatherCalendar
//         type={weatherType}
//         selectedIndex={weatherFrame}
//         onSelect={setWeatherFrame}
//       />

//       <SevenSegmentTime date={selectedWeatherDate} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: 55,
//     left: 15,
//     zIndex: 100,
//   },

//   menuButton: {
//     width: 46,
//     height: 46,
//     borderRadius: 10,
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "center",

//     elevation: 5,

//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//   },

//   menuIcon: {
//     fontSize: 24,
//   },

//   menu: {
//     position: "absolute",
//     top: 55,
//     left: 0,

//     width: 190,

//     backgroundColor: "white",
//     borderRadius: 12,

//     paddingVertical: 6,

//     elevation: 8,

//     shadowColor: "#000",
//     shadowOpacity: 0.18,
//     shadowRadius: 6,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//   },

//   title: {
//     fontSize: 14,
//     fontWeight: "700",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//   },

//   option: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },

//   selectedOption: {
//     backgroundColor: "#e8f3ff",
//   },

//   optionText: {
//     fontSize: 14,
//   },

//   selectedText: {
//     fontWeight: "600",
//     color: "#007AFF",
//   },
// });

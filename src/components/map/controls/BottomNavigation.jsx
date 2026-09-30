import { Image, Pressable, StyleSheet, View } from "react-native";

import { useMap } from "../context/MapContext";

const ITEMS = [
  {
    id: "flood",
    label: "Flood",
    icon: "https://mowaterinfo.itrss.mst.edu/assets/MEI/MEI/img/flood-lvl.png",
  },
  {
    id: "streams",
    label: "Streams",
    icon: "https://mowaterinfo.itrss.mst.edu/assets/MEI/MEI/img/river.png",
  },
  {
    id: "drought",
    label: "Drought",
    icon: "https://mowaterinfo.itrss.mst.edu/assets/MEI/MEI/img/drought2.0.png",
  },
  {
    id: "weather",
    label: "Weather",
    icon: "https://mowaterinfo.itrss.mst.edu/assets/MEI/MEI/img/cloud.jpg",
  },
  {
    id: "railroad",
    label: "Railroad",
    icon: "https://mowaterinfo.itrss.mst.edu/assets/MEI/MEI/img/railroad.png",
  },
];

export default function BottomNavigation() {
  const { activeLayer, setActiveLayer } = useMap();

  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const active = activeLayer === item.id;

        return (
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() => setActiveLayer(item.id)}
          >
            <Image
              source={{ uri: item.icon }}
              style={[styles.icon, active && styles.activeIcon]}
              resizeMode="contain"
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 5,
    elevation: 8,
  },

  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
  },

  icon: {
    width: 36,
    height: 36,
    marginBottom: 1,
  },

  activeIcon: {
    transform: [{ scale: 1.1 }],
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  activeLabel: {
    color: "#007AFF",
    fontWeight: "700",
  },
});

// import { Pressable, StyleSheet, Text, View } from "react-native";

// import { useMap } from "../context/MapContext";

// const ITEMS = [
//   {
//     id: "flood",
//     label: "Flood",
//     icon: "🌊",
//   },
//   {
//     id: "streams",
//     label: "Streams",
//     icon: "〰️",
//   },
//   {
//     id: "drought",
//     label: "Drought",
//     icon: "🏜️",
//   },
//   {
//     id: "weather",
//     label: "Weather",
//     icon: "🌧️",
//   },
//   {
//     id: "railroad",
//     label: "Railroad",
//     icon: "🚂",
//   },
// ];

// export default function BottomNavigation() {
//   const { activeLayer, setActiveLayer } = useMap();

//   return (
//     <View style={styles.container}>
//       {ITEMS.map((item) => {
//         const active = activeLayer === item.id;

//         return (
//           <Pressable
//             key={item.id}
//             style={styles.item}
//             onPress={() => setActiveLayer(item.id)}
//           >
//             <Text style={styles.icon}>{item.icon}</Text>

//             <Text style={[styles.label, active && styles.activeLabel]}>
//               {item.label}
//             </Text>
//           </Pressable>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 14,
//     paddingVertical: 8,
//     elevation: 8,
//   },

//   item: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 8,
//   },

//   icon: {
//     fontSize: 18,
//     marginBottom: 3,
//   },

//   label: {
//     fontSize: 12,
//     color: "#777",
//   },

//   activeLabel: {
//     color: "#007AFF",
//     fontWeight: "700",
//   },
// });

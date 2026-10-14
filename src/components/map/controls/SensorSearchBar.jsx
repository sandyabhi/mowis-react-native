import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const DEBOUNCE_MS = 300;
const MAX_RESULTS = 8;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function SensorSearchBar({ sensors = [], onSearch, onSelect }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      onSearch?.(query.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const results = (() => {
    const value = debouncedQuery.trim();

    if (!value) return [];

    let regex;

    try {
      regex = new RegExp(escapeRegex(value), "i");
    } catch {
      return [];
    }

    return sensors
      .filter((feature) => {
        const properties = feature.properties ?? {};
        const name = String(properties.siteName ?? properties.site_name ?? "");
        const id = String(properties.sensorId ?? "");

        return regex.test(name) || regex.test(id);
      })
      .slice(0, MAX_RESULTS);
  })();

  function clearSearch() {
    setQuery("");
    setDebouncedQuery("");
    setShowOptions(false);
    onSearch?.("");
  }

  function selectSensor(feature) {
    const properties = feature.properties ?? {};
    const name =
      properties.siteName ??
      properties.site_name ??
      properties.sensorId ??
      "Selected sensor";

    setQuery(String(name));
    setDebouncedQuery("");
    setShowOptions(false);
    onSearch?.("");
    onSelect?.(feature);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search sensor name or ID..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <Pressable onPress={clearSearch} hitSlop={10}>
            <Text style={styles.clear}>×</Text>
          </Pressable>
        )}
      </View>

      {showOptions && debouncedQuery.length > 0 && (
        <View style={styles.dropdown}>
          {results.length > 0 ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              style={styles.resultsList}
            >
              {results.map((feature, index) => {
                const properties = feature.properties ?? {};
                const name =
                  properties.siteName ??
                  properties.site_name ??
                  "Unnamed sensor";
                const id = properties.sensorId ?? "";

                return (
                  <Pressable
                    key={`${id}-${index}`}
                    style={styles.option}
                    onPress={() => selectSensor(feature)}
                  >
                    <Text style={styles.optionName} numberOfLines={2}>
                      {name}
                    </Text>
                    {!!id && <Text style={styles.optionId}>ID: {id}</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noResults}>No matching sensors found</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    width: "100%",
    paddingHorizontal: 12,
    flex: 1,
    zIndex: 90,
    elevation: 8,
  },
  searchRow: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
  },
  clear: {
    fontSize: 23,
    color: "#666666",
    paddingLeft: 8,
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 8,
  },
  resultsList: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDDDDD",
  },
  optionName: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "500",
  },
  optionId: {
    fontSize: 12,
    color: "#666666",
    marginTop: 3,
  },
  noResults: {
    padding: 14,
    color: "#666666",
    fontSize: 14,
  },
});

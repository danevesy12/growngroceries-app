// App.js  or app/index.js
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Dimensions, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const suppliers = [
    { id: 1, name: "Local Farm Stand", latitude: 37.779, longitude: -122.429 },
    { id: 2, name: "Organic Market", latitude: 37.769, longitude: -122.419 },
    { id: 3, name: "Urban Garden", latitude: 37.774, longitude: -122.414 },
  ];

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
        showsMyLocationButton={Platform.OS === "android"}
      >
        {filtered.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.name}
          />
        ))}
      </MapView>

      <TextInput
        style={styles.searchBox}
        placeholder="Search local suppliers..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

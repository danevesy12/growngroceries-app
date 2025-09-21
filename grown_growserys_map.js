import React, { useState } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [region, setRegion] = useState({
    latitude: 37.7749, // default: San Francisco
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Example suppliers (later you can fetch from GCP backend or Firestore)
  const suppliers = [
    { id: 1, name: "Local Farm Stand", latitude: 37.779, longitude: -122.429 },
    { id: 2, name: "Organic Market", latitude: 37.769, longitude: -122.419 },
    { id: 3, name: "Urban Garden", latitude: 37.774, longitude: -122.414 },
  ];

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onRegionChange={setRegion}>
        {filteredSuppliers.map((supplier) => (
          <Marker
            key={supplier.id}
            coordinate={{
              latitude: supplier.latitude,
              longitude: supplier.longitude,
            }}
            title={supplier.name}
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
  container: {
    flex: 1,
  },
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
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

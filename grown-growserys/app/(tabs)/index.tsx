import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Dimensions, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { auth, db, storage } from "../../firebase"; // adjust path
import { signInAnonymously, UserCredential } from "firebase/auth";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Example supplier data
  const suppliers = [
    { id: 1, name: "Cumboots Milk", latitude: 54.28, longitude: -0.45 },
    { id: 2, name: "Bagles Lady", latitude: 54.28, longitude: -0.426 },
    { id: 3, name: "Spence Butchers", latitude: 54.28, longitude: -0.404 },
  ];

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  useEffect(() => {
    // Firebase JS SDK anonymous sign-in
    signInAnonymously(auth)
      .then((userCredential: UserCredential) => {
        console.log("Signed in anonymously!", userCredential.user.uid);
      })
      .catch((err: any) => console.error("Auth error:", err));

    console.log("Firestore instance:", db);
    console.log("Storage instance:", storage);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 54.28,
          longitude: -0.4,
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
    backgroundColor: "#FDF7F5",
    color: "#531D1D",
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

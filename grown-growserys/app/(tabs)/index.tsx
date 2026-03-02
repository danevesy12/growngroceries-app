import React, { useState, useEffect } from "react";
import {
  View, TextInput, StyleSheet, Dimensions, Platform,
  TouchableOpacity, FlatList, Text,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import { auth, db, storage } from "../../firebase";
import { signInAnonymously, UserCredential } from "firebase/auth";
import { SUPPLIERS } from "../../constants/suppliers";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential: UserCredential) => {
        console.log("Signed in anonymously!", userCredential.user.uid);
      })
      .catch((err: any) => console.error("Auth error:", err));

    console.log("Firestore instance:", db);
    console.log("Storage instance:", storage);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
  }, []);

  const filtered = SUPPLIERS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const sorted = userLocation
    ? [...filtered].sort(
        (a, b) =>
          haversineKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) -
          haversineKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
      )
    : filtered;

  return (
    <View style={styles.container}>
      {showList ? (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const dist = userLocation
              ? haversineKm(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude)
              : null;
            return (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/supplier/${item.id}`)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  {dist !== null && (
                    <Text style={styles.cardDist}>{dist.toFixed(1)} km away</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            );
          }}
          ListHeaderComponent={
            <TextInput
              style={styles.searchBoxList}
              placeholder="Search suppliers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          }
        />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 54.28,
              longitude: -0.4,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsMyLocationButton={Platform.OS === "android"}
          >
            {filtered.map((s) => (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.latitude, longitude: s.longitude }}
              >
                <Callout onPress={() => router.push(`/supplier/${s.id}`)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName}>{s.name}</Text>
                    <Text style={styles.calloutCategory}>{s.category}</Text>
                    <Text style={styles.calloutCta}>Shop</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          <TextInput
            style={styles.searchBox}
            placeholder="Search local suppliers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </>
      )}

      {/* Toggle button */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setShowList((v) => !v)}
      >
        <Ionicons
          name={showList ? "map" : "list"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF7E9" },

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

  listContent: { paddingBottom: 100 },

  searchBoxList: {
    margin: 16,
    marginTop: 60,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  callout: { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 0, minWidth: 160 },
  calloutName: { fontSize: 15, fontWeight: "700", color: "#531D1D" },
  calloutCategory: { fontSize: 12, color: "#888", marginTop: 2 },
  calloutCta: { fontSize: 16, color: "#3B3A36", marginTop: 4, fontWeight: "600", marginBottom: 0 },

  cardName: { fontSize: 16, fontWeight: "600", color: "#531D1D" },
  cardCategory: { fontSize: 12, color: "#aaa", marginTop: 2 },
  cardDist: { fontSize: 13, color: "#888", marginTop: 2 },

  toggleBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#531D1D",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});

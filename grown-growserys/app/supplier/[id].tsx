import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SUPPLIERS, Product } from "../../constants/suppliers";

export default function SupplierPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const supplier = SUPPLIERS.find((s) => s.id === Number(id));

  const [basket, setBasket] = useState<Record<number, number>>({});

  if (!supplier) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Supplier not found.</Text>
      </SafeAreaView>
    );
  }

  const addToBasket = (product: Product) => {
    setBasket((prev) => ({ ...prev, [product.id]: (prev[product.id] ?? 0) + 1 }));
    Alert.alert("Added", `${product.name} added to basket`);
  };

  const totalItems = Object.values(basket).reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#531D1D" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.supplierName}>{supplier.name}</Text>
          <Text style={styles.category}>{supplier.category}</Text>
        </View>
        {totalItems > 0 && (
          <View style={styles.basketBadge}>
            <Ionicons name="cart" size={20} color="#531D1D" />
            <Text style={styles.basketCount}>{totalItems}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{supplier.description}</Text>

      <Text style={styles.sectionTitle}>Products</Text>

      <FlatList
        data={supplier.products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDesc}>{item.description}</Text>
              <Text style={styles.productUnit}>{item.unit}</Text>
            </View>
            <View style={styles.productRight}>
              <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => addToBasket(item)}>
                {basket[item.id] ? (
                  <Text style={styles.addBtnText}>{basket[item.id]} in basket</Text>
                ) : (
                  <Ionicons name="add" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF7E9" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerText: { flex: 1 },
  supplierName: { fontSize: 20, fontWeight: "700", color: "#531D1D" },
  category: { fontSize: 13, color: "#888", marginTop: 2 },
  basketBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  basketCount: { fontSize: 16, fontWeight: "700", color: "#531D1D" },

  description: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 20,
    paddingBottom: 12,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#531D1D",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  list: { paddingHorizontal: 16, paddingBottom: 40 },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  productInfo: { flex: 1, marginRight: 12 },
  productName: { fontSize: 15, fontWeight: "600", color: "#222" },
  productDesc: { fontSize: 13, color: "#888", marginTop: 2 },
  productUnit: { fontSize: 12, color: "#aaa", marginTop: 2 },

  productRight: { alignItems: "flex-end", gap: 8 },
  productPrice: { fontSize: 16, fontWeight: "700", color: "#531D1D" },
  addBtn: {
    backgroundColor: "#531D1D",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  addBtnText: { color: "#fff", fontSize: 11, fontWeight: "600", textAlign: "center" },

  errorText: { textAlign: "center", marginTop: 40, color: "#888" },
});

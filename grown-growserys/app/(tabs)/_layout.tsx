
import 'react-native-reanimated';

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";

          if (route.name === "account") iconName = "person";
          else if (route.name === "index") iconName = "map";
          else if (route.name === "suppliers") iconName = "list";
          else if (route.name === "basket") iconName = "cart";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
            // 👇 Tab bar styles
        tabBarActiveTintColor: "#531D1D",   // active icon/text color
        tabBarInactiveTintColor: "#9E9E9E", // inactive color
        tabBarStyle: {
          backgroundColor: "#FDF7E9",       // background color
          borderTopColor: "#ddd",           // top border
          height: 60,                       // taller bar
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tabs.Screen name="account" options={{ title: "Account" }} />
      <Tabs.Screen name="index" options={{ title: "Map" }} />
      <Tabs.Screen name="suppliers" options={{ title: "Suppliers" }} />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Basket",
          tabBarBadge: 0, // optional: shows number of items in basket
        }}
      />
    </Tabs>
  );
}

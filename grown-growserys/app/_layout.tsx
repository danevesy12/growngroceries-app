// ✅ MUST be the first import — do not move or add anything above this.
import 'react-native-reanimated';

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'account') iconName = 'person';
          else if (route.name === 'index') iconName = 'map';
          else if (route.name === 'suppliers') iconName = 'list';
          else if (route.name === 'basket') iconName = 'cart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#531D1D',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#FDF7E9',
          borderTopColor: '#ddd',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
      <Tabs.Screen name="index" options={{ title: 'Map' }} />
      <Tabs.Screen name="suppliers" options={{ title: 'Suppliers' }} />
      <Tabs.Screen name="basket" options={{ title: 'Basket', tabBarBadge: 0 }} />
    </Tabs>
  );
}

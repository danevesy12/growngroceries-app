import 'react-native-reanimated'; // must be first
import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
        switch (route.name) {
          case 'account':
            iconName = 'person';
            break;
          case 'index':
            iconName = 'map';
            break;
          case 'basket':
            iconName = 'cart';
            break;
        }

        if (route.name === 'suppliers') {
          return {
            tabBarIcon: ({ size, focused }) => <Text style={{ fontSize: size, opacity: focused ? 1 : 0.4 }}>🧑‍🌾</Text>,
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
          };
        }

        return {
          tabBarIcon: ({ color, size }) => <Ionicons name={iconName} size={size} color={color} />,
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
        };
      }}
    >
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
      <Tabs.Screen name="index" options={{ title: 'Map' }} />
      <Tabs.Screen name="suppliers" options={{ title: 'Suppliers' }} />
      <Tabs.Screen name="basket" options={{ title: 'Basket', tabBarBadge: 0 }} />
    </Tabs>
  );
}

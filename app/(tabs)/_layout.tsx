import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import {COLORS} from '../../constants/Colors'; 
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
  screenOptions={{
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarActiveTintColor: COLORS.secondary, // 👈 Set active tab icon/text color here
    //tabBarInactiveTintColor: COLORS.secondary,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
      },
      default: {},
    }),
  }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="house.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="explore"
    options={{
      title: 'Recents',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="paperplane.fill" color={color} />
      ),
    }}
  />
</Tabs>

  );
}

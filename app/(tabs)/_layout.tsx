import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Plus } from 'lucide-react';  // Import Plus from lucide-react

const TabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const greenColor = '#32CD32';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          height: 50,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={greenColor} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'Post',
          tabBarIcon: ({ color, focused }) => (
            <Plus color={greenColor} size={20} />  // Use Plus component from lucide-react
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Data',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} color={greenColor} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={greenColor} size={20} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

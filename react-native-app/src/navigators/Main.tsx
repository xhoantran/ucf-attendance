/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { History, ScanQR, Settings } from '../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Attendance') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'today' : 'today-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: props => {
          const { children, focused, color } = props;
          return (
            <Text
              style={{
                color: focused ? '#ca8a04' : color,
                fontSize: 12,
              }}
            >
              {children}
            </Text>
          );
        },
        tabBarStyle: {
          height: 64,
          paddingTop: 16,
        },
        tabBarActiveTintColor: '#eab308',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Attendance" component={ScanQR} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

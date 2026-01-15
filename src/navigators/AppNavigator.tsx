import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/colors';
import { AppStackParamList } from './types';
import { scale, scaleFont } from '../utils/scaling';
import { APP_NAVIGATION, ICONS } from '../constants/strings';

const Tab = createBottomTabNavigator<AppStackParamList>();

// Placeholder components for app screens
const HomeScreen: React.FC = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>{APP_NAVIGATION.HOME}</Text>
    <Text style={styles.screenText}>{APP_NAVIGATION.HOME_WELCOME}</Text>
  </View>
);

const ProfileScreen: React.FC = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>{APP_NAVIGATION.PROFILE}</Text>
    <Text style={styles.screenText}>{APP_NAVIGATION.PROFILE_DESCRIPTION}</Text>
  </View>
);

const SettingsScreen: React.FC = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>{APP_NAVIGATION.SETTINGS}</Text>
    <Text style={styles.screenText}>{APP_NAVIGATION.SETTINGS_DESCRIPTION}</Text>
  </View>
);

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.SECONDARY,
          borderTopWidth: scale(1),
          paddingBottom: scale(8),
          paddingTop: scale(8),
          height: scale(80),
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarLabelStyle: {
          fontSize: scaleFont(12),
          fontWeight: '600',
          fontFamily: 'varela_round_regular',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: APP_NAVIGATION.HOME,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>{ICONS.HOME}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: APP_NAVIGATION.PROFILE,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>{ICONS.PROFILE}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: APP_NAVIGATION.SETTINGS,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>{ICONS.SETTINGS}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  screenTitle: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(8),
  },
  screenText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  tabIcon: {
    fontSize: scaleFont(24),
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
});

export default AppNavigator;

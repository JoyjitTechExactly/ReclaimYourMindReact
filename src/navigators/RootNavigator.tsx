import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { RootState } from '../redux/store';
import { RootStackParamList } from './types';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  // Get authentication state from Redux
  const { isAuthenticated, isAccountCreationComplete, isRestoring } = useSelector((state: RootState) => state.auth);

  // Show loading screen while restoring auth state to prevent flicker
  if (isRestoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  // Routing logic:
  // - Not logged in → AuthNavigator (Onboarding)
  // - Logged in but account creation incomplete → AuthNavigator (JourneyStart)
  // - Logged in and account creation complete → AppNavigator (Home)
  
  // Show App navigator only if user is authenticated AND account creation is complete
  const shouldShowApp = isAuthenticated && isAccountCreationComplete;

  // Use a stable key that only changes when we actually need to switch between Auth and App
  // This prevents unnecessary remounting during the signup flow
  const navigatorKey = shouldShowApp ? 'app-navigator' : 'auth-navigator';

  return (
    <Stack.Navigator
      key={navigatorKey}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}  
    >
      {shouldShowApp ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default RootNavigator;

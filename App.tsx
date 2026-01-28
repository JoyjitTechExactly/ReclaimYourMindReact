/**
 * Reclaim Your Mind App
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { COLORS } from './src/constants/colors';
import { restoreAuthStateAsync } from './src/redux/slices/auth/authSlice';
import { AppDispatch } from './src/redux/store';
import Toast from 'react-native-toast-message';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar 
            barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
            backgroundColor={COLORS.BACKGROUND}
          />
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Restore auth state from AsyncStorage on app startup
    dispatch(restoreAuthStateAsync());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <RootNavigator />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

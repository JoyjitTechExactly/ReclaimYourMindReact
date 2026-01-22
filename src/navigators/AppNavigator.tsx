import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useNavigationState, NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from './types';
import HomeNavigator from './HomeNavigator';
import ResourcesScreen from '../feature/resources/ResourcesScreen';
import JournalNavigator from './JournalNavigator';
import ProfileNavigator from './ProfileNavigator';
import CustomTabBar from '../components/home/CustomTabBar';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const backPressCount = useRef(0);
  const backPressTimeout = useRef<number | null>(null);

  // Get the current navigation state to check if we're on the Home screen
  const navigationState = useNavigationState(state => state);

  // Check if we're on the Dashboard screen (not on any journey screens)
  const isOnHomeScreen = () => {
    if (!navigationState) return false;
    
    // Find the Dashboard tab
    const homeTab = navigationState.routes.find(route => route.name === 'Dashboard');
    if (!homeTab || !homeTab.state || homeTab.state.index === undefined) return false;
    
    // Check if the current screen in the Dashboard stack is 'Dashboard'
    const currentRoute = homeTab.state.routes[homeTab.state.index];
    return currentRoute?.name === 'Dashboard';
  };

  useEffect(() => {
    const onBackPress = () => {
      // Only show exit confirmation if we're on the Home screen
      if (!isOnHomeScreen()) {
        // Let React Navigation handle the back button normally
        return false;
      }

      // We're on the Home screen, show exit confirmation
      backPressCount.current += 1;

      if (backPressCount.current === 1) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        } else {
          Toast.show({
            type: 'info',
            text1: 'Press again to exit',
            position: 'bottom',
          });
        }
      } else if (backPressCount.current === 2) {
        if (Platform.OS === 'android') {
          BackHandler.exitApp();
        }
        return true;
      }

      backPressTimeout.current = setTimeout(() => {
        backPressCount.current = 0;
      }, 2000) as unknown as number;

      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => {
      subscription.remove();
      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
      }
    };
  }, [navigationState]);
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarLabel: 'Resources',
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalNavigator}
        options={{
          tabBarLabel: 'Journal',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

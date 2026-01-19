import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from './types';
import HomeScreen from '../feature/home/HomeScreen';
import ResourcesScreen from '../feature/resources/ResourcesScreen';
import JournalNavigator from './JournalNavigator';
import ProfileNavigator from './ProfileNavigator';
import CustomTabBar from '../components/common/home/CustomTabBar';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const backPressCount = useRef(0);
  const backPressTimeout = useRef<number | null>(null)

  useEffect(() => {
    const onBackPress = () => {
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
  }, []);
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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

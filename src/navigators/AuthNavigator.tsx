import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboard, SignIn, SignUp } from '../feature/auth';
import { AuthStackParamList } from './types';
import { AUTH_NAVIGATION } from '../constants/strings';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Onboard"
        component={Onboard}
        options={{
          title: AUTH_NAVIGATION.WELCOME,
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          title: AUTH_NAVIGATION.SIGN_IN,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          title: AUTH_NAVIGATION.SIGN_UP,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

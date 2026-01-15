import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboard, SignIn, SignUp } from '../feature/auth';
import { ForgotPassword, OTP, ResetPassword, PasswordConfirmation } from '../feature/auth/forgotPwd';
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
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          title: 'Reset Password',
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{
          title: 'Verify Code',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: 'Set New Password',
        }}
      />
      <Stack.Screen
        name="PasswordConfirmation"
        component={PasswordConfirmation}
        options={{
          title: 'Success',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboard, SignIn, SignUp } from '../feature/auth';
import { ForgotPassword, OTP, ResetPassword, PasswordConfirmation } from '../feature/auth/forgotPwd';
import { StartMyJourney, SignUpConfirmation } from '../feature/auth/signUp';
import { AuthStackParamList } from './types';
import { AUTH_NAVIGATION } from '../constants/strings';
import { useAppSelector } from '../redux/hooks';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isAccountCreationComplete } = useAppSelector((state) => state.auth);
  
  // Calculate initial route based on auth state
  // IMPORTANT: initialRouteName only works on first mount
  // RootNavigator waits for isRestoring to be false before rendering AuthNavigator,
  // so by the time this mounts, auth state should be restored
  const initialRoute = React.useMemo<keyof AuthStackParamList>(() => {
    // If user is authenticated but account creation is incomplete, show JourneyStart
    if (isAuthenticated && !isAccountCreationComplete) {
      return 'JourneyStart';
    }
    
    // Otherwise start at Onboard (normal flow - new user or not authenticated)
    return 'Onboard';
  }, [isAuthenticated, isAccountCreationComplete]);

  return (
    <Stack.Navigator
      key="auth-navigator" // Stable key - don't remount during navigation
      initialRouteName={initialRoute}
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
        name="JourneyStart"
        component={StartMyJourney}
        options={{
          title: 'Start Your Journey',
        }}
      />
      <Stack.Screen
        name="JourneyCompletion"
        component={SignUpConfirmation}
        options={{
          title: 'Journey Complete',
          gestureEnabled: false, // Prevent swipe back
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
          gestureEnabled: false,  
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

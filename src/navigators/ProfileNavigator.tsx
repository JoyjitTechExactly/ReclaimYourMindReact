import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import ProfileScreen from '../feature/profile/ProfileScreen';
import EditProfileScreen from '../feature/profile/EditProfileScreen';
import ChangePasswordScreen from '../feature/profile/ChangePasswordScreen';

const Stack = createStackNavigator<AppStackParamList>();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;


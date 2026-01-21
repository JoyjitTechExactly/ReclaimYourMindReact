import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import HomeScreen from '../feature/home/HomeScreen';
import ActionIntroScreen from '../feature/home/journey/ActionIntroScreen';
import TopicListingScreen from '../feature/home/journey/TopicListingScreen';
import TopicDetailsScreen from '../feature/home/journey/TopicDetailsScreen';
import ExtraVideosScreen from '../feature/home/journey/ExtraVideosScreen';
import TopicCompletionScreen from '../feature/home/journey/TopicCompletionScreen';

const Stack = createStackNavigator<AppStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ActionIntro" component={ActionIntroScreen} />
      <Stack.Screen name="TopicListing" component={TopicListingScreen} />
      <Stack.Screen name="TopicDetails" component={TopicDetailsScreen} />
      <Stack.Screen name="ExtraVideos" component={ExtraVideosScreen} />
      <Stack.Screen name="TopicCompletion" component={TopicCompletionScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;


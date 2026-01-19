import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import JournalScreen from '../feature/journal/JournalScreen';
import NewJournalEntryScreen from '../feature/journal/NewJournalEntryScreen';
import JournalEntryDetailScreen from '../feature/journal/JournalEntryDetailScreen';
import QAReflectionDetailScreen from '../feature/journal/QAReflectionDetailScreen';

const Stack = createStackNavigator<AppStackParamList>();

const JournalNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="NewJournalEntry" component={NewJournalEntryScreen} />
      <Stack.Screen name="JournalEntryDetail" component={JournalEntryDetailScreen} />
      <Stack.Screen name="QAReflectionDetail" component={QAReflectionDetailScreen} />
    </Stack.Navigator>
  );
};

export default JournalNavigator;


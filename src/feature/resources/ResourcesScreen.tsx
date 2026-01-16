import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { APP_NAVIGATION } from '../../constants/strings';

const ResourcesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>{APP_NAVIGATION.RESOURCES}</Text>
      <Text style={styles.subtitle}>{APP_NAVIGATION.RESOURCES_DESCRIPTION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: scale(24),
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginTop: scale(20),
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
  },
});

export default ResourcesScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JOURNEY } from '../../../../constants/strings';
import { commonStyles } from '../../../../styles/commonStyles';
import { COLORS } from '../../../../constants/colors';
import { scale, scaleFont } from '../../../../utils/scaling';

interface JourneyTagsProps {
  stepType: string;
  version?: string;
  showVersionToggle?: boolean;
}

const JourneyTags: React.FC<JourneyTagsProps> = ({ 
  stepType, 
  version, 
  showVersionToggle = false 
}) => {
  return (
    <View style={styles.headerTags}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>{stepType}</Text>
      </View>
      {showVersionToggle && version && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {JOURNEY.TRACK.replace('{version}', version)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerTags: {
    ...commonStyles.row,
    ...commonStyles.gap8,
    marginLeft: scale(12),
    alignItems: 'center',
  },
  tag: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
  },
  tagText: {
    fontSize: scaleFont(12),
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    fontWeight: '500',
  },
});

export default JourneyTags;


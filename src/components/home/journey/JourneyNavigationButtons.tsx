import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../../common/CustomButton';
import { scale, scaleFont } from '../../../utils/scaling';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';


interface JourneyNavigationButtonsProps {
  primaryButtonTitle: string;
  secondaryButtonTitle: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  containerStyle?: object;
}

const JourneyNavigationButtons: React.FC<JourneyNavigationButtonsProps> = ({
  primaryButtonTitle,
  secondaryButtonTitle,
  onPrimaryPress,
  onSecondaryPress,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <CustomButton
        title={primaryButtonTitle}
        onPress={onPrimaryPress}
        variant="primary"   
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}
      />
      <CustomButton
        title={secondaryButtonTitle}
        onPress={onSecondaryPress}
        variant="ghost"
        style={styles.secondaryButton}
        textStyle={styles.secondaryButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: scale(12),
    paddingTop: scale(24),
    backgroundColor: COLORS.WHITE,
    borderTopWidth: scale(1),
    borderTopColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(12),
    padding: scale(16),
    ...commonStyles.cardShadow,
  },
  primaryButton: {
    width: '100%',
    borderRadius: scale(8),
    paddingVertical: scale(14),
  },
  primaryButtonText: {
    fontSize: scaleFont(16),
    fontFamily: 'varela_round_regular',
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: scale(8),
    paddingVertical: scale(14),
    backgroundColor: '#D0E6F4', // Light blue background as shown in image
  },
  secondaryButtonText: {
    fontSize: scaleFont(16),
    fontFamily: 'varela_round_regular',
    fontWeight: '600',
    color: COLORS.PRIMARY, // Dark blue-gray text
  },
});

export default JourneyNavigationButtons;


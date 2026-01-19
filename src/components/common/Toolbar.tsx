import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { commonStyles } from '../../styles/commonStyles';
import BackButton from './BackButton';

interface ToolbarProps {
  title: string;
  onBackPress: () => void;
  bottomMargin?: number;
  backButtonColor?: string;
  backgroundColor?: string;
  showBackButton?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  onBackPress,
  bottomMargin = 30,
  backButtonColor = COLORS.PRIMARY,
  backgroundColor = COLORS.WHITE,
  showBackButton = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + scale(24),
          padding: scale(24),
          backgroundColor,
        },
      ]}
    >
      {showBackButton && (
        <BackButton
          onPress={onBackPress}
          bottomMargin={bottomMargin}
          color={backButtonColor}
        />
      )}
      <Text style={commonStyles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default Toolbar;


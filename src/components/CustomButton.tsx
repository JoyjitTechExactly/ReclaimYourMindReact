import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { scale, scaleFont } from '../utils/scaling';

interface DefaultButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'login';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const CustomButton: React.FC<DefaultButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : 
    variant === 'secondary' ? styles.secondaryButton :
    variant === 'ghost' ? styles.ghostButton :
    variant === 'login' ? styles.loginButton :
    styles.primaryButton,
    disabled && styles.disabledButton,
    fullWidth && styles.fullWidth,
    style,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    variant === 'primary' ? styles.primaryButtonText : 
    variant === 'secondary' ? styles.secondaryButtonText :
    variant === 'ghost' ? styles.ghostButtonText :
    variant === 'login' ? styles.loginButtonText :
    styles.primaryButtonText,
    disabled && styles.disabledButtonText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 0.5 : 1}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: scale(16),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: scale(2),
    borderColor: COLORS.PRIMARY,
    paddingVertical: scale(14),
  },
  ghostButton: {
    backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue background
    paddingVertical: scale(12),
    borderRadius: scale(20), // More rounded for oval shape
  },
  loginButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: scale(8),
    paddingHorizontal: scale(15),
    borderRadius: scale(50),
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY,
    borderColor: COLORS.GRAY,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },
  primaryButtonText: {
    color: COLORS.WHITE,
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
  },
  ghostButtonText: {
    color: COLORS.PRIMARY,
    fontSize: scaleFont(14),
  },
  loginButtonText: {
    color: COLORS.PRIMARY,
    fontSize: scaleFont(16),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },
  disabledButtonText: {
    color: COLORS.WHITE,
  },
});

export default CustomButton;

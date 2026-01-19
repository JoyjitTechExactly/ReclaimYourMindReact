import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { PASSWORD_INPUT, ICONS } from '../../constants/strings';
import { ImagePath } from '../../constants/imagePath';
import { commonStyles } from '../../styles/commonStyles';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  showRequirements?: boolean;
  requirements?: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
  showRequirements = false,
  requirements,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const RequirementItem: React.FC<{ text: string; isValid: boolean }> = ({ text, isValid }) => (
    <Text style={[styles.requirementText, { color: isValid ? COLORS.SUCCESS : COLORS.GRAY }]}>
      {isValid ? '✓' : '•'} {text}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={PASSWORD_INPUT.PASSWORD_PLACEHOLDER}
          placeholderTextColor={COLORS.GRAY}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image source={showPassword ? ImagePath.EyeOpen : ImagePath.EyeClosed} style={commonStyles.smallIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {showRequirements && requirements && (
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>{PASSWORD_INPUT.PASSWORD_REQUIREMENTS_TITLE}</Text>
          <RequirementItem text={PASSWORD_INPUT.REQUIREMENT_LENGTH} isValid={requirements.length} />
          <RequirementItem text={PASSWORD_INPUT.REQUIREMENT_UPPERCASE} isValid={requirements.uppercase} />
          <RequirementItem text={PASSWORD_INPUT.REQUIREMENT_LOWERCASE} isValid={requirements.lowercase} />
          <RequirementItem text={PASSWORD_INPUT.REQUIREMENT_NUMBER} isValid={requirements.number} />
          <RequirementItem text={PASSWORD_INPUT.REQUIREMENT_SPECIAL} isValid={requirements.special} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIconText: {
    fontSize: 20,
    fontFamily: 'varela_round_regular',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
    fontFamily: 'varela_round_regular',
    marginTop: 4,
  },
  requirementsContainer: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'varela_round_regular',
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default PasswordInput;

import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/colors';
import { AUTH_INPUT } from '../../constants/strings';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, error, ...props }) => {
  const getLabelText = () => {
    switch (label) {
      case 'Email':
        return AUTH_INPUT.EMAIL_LABEL;
      case 'Password':
        return AUTH_INPUT.PASSWORD_LABEL;
      default:
        return label;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{getLabelText()}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor={COLORS.GRAY}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  input: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
    fontFamily: 'varela_round_regular',
    marginTop: 4,
  },
});

export default AuthInput;

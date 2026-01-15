import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../utils/scaling';
import BackButton from '../../components/BackButton';
import { SIGN_UP, ERRORS, ICONS } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import { commonStyles } from '../../styles/commonStyles';

type SignUpNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(password);

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', ERRORS.FILL_ALL_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', ERRORS.PASSWORDS_DO_NOT_MATCH);
      return;
    }

    const isValid = Object.values(passwordRequirements).every(Boolean);
    if (!isValid) {
      Alert.alert('Error', ERRORS.PASSWORD_REQUIREMENTS);
      return;
    }

    // Handle sign up logic here
    console.log('Sign up with:', fullName, email, password);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const RequirementItem: React.FC<{ text: string; isValid: boolean }> = ({ text, isValid }) => (
    <Text style={[commonStyles.textSmall, { color: isValid ? COLORS.SUCCESS : COLORS.GRAY, lineHeight: scaleFont(20), marginBottom: scale(4) }]}>
      {isValid ? '✓' : '•'} {text}
    </Text>
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.content, { paddingBottom: scale(40) }]}>
          {/* Back Arrow */}
          <BackButton onPress={handleBack} />

          <View style={{ marginTop: scale(40), alignItems: 'center' }}>
            <Text style={commonStyles.title}>{SIGN_UP.TITLE}</Text>
            <Text style={[commonStyles.subtitle, { lineHeight: scaleFont(24) }]}>{SIGN_UP.SUBTITLE}</Text>
          </View>

          <View style={[commonStyles.form, { marginTop: scale(56) }]}>
            <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
              <Text style={commonStyles.inputLabel}>{SIGN_UP.FULL_NAME_LABEL}</Text>
              <TextInput
                style={commonStyles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder={SIGN_UP.FULL_NAME_PLACEHOLDER}
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
              <Text style={commonStyles.inputLabel}>{SIGN_UP.EMAIL_LABEL}</Text>
              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={SIGN_UP.EMAIL_PLACEHOLDER}
                placeholderTextColor={COLORS.GRAY}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
              <Text style={commonStyles.inputLabel}>{SIGN_UP.PASSWORD_LABEL}</Text>
              <View style={commonStyles.passwordContainer}>
                <TextInput
                  style={commonStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={SIGN_UP.PASSWORD_PLACEHOLDER}
                  placeholderTextColor={COLORS.GRAY}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={commonStyles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={commonStyles.eyeIconText}>{showPassword ? ICONS.EYE_OPEN : ICONS.EYE_CLOSED}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
              <Text style={commonStyles.inputLabel}>{SIGN_UP.CONFIRM_PASSWORD_LABEL}</Text>
              <View style={commonStyles.passwordContainer}>
                <TextInput
                  style={commonStyles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={SIGN_UP.CONFIRM_PASSWORD_PLACEHOLDER}
                  placeholderTextColor={COLORS.GRAY}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={commonStyles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={commonStyles.eyeIconText}>{showConfirmPassword ? ICONS.EYE_OPEN : ICONS.EYE_CLOSED}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={commonStyles.card}>
              <Text style={commonStyles.inputLabel}>{SIGN_UP.PASSWORD_REQUIREMENTS_TITLE}</Text>
              <RequirementItem text={SIGN_UP.REQUIREMENT_LENGTH} isValid={passwordRequirements.length} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_UPPERCASE} isValid={passwordRequirements.uppercase} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_LOWERCASE} isValid={passwordRequirements.lowercase} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_NUMBER} isValid={passwordRequirements.number} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_SPECIAL} isValid={passwordRequirements.special} />
            </View>

            <CustomButton
              title={SIGN_UP.CREATE_ACCOUNT}
              onPress={handleSignUp}
              style={{ marginTop: scale(24) }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // No custom styles needed - all using commonStyles
});

export default SignUp;

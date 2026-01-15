import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import { SIGN_UP, ERRORS, ICONS } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';

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

    // Navigate to StartMyJourney screen
    navigation.navigate('StartMyJourney');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const RequirementItem: React.FC<{ text: string; isValid: boolean }> = ({ text, isValid }) => (
    <View style={styles.passwordRule}>
      <View style={[styles.radioIcon, { 
        backgroundColor: isValid ? COLORS.SUCCESS : 'transparent',
        borderColor: isValid ? COLORS.SUCCESS : COLORS.GRAY 
      }]}>
        {isValid && <View style={styles.radioInnerCircle} />}
      </View>
      <Text style={[styles.passwordRuleText, { color: isValid ? COLORS.TEXT_PRIMARY : COLORS.GRAY }]}>
        {text}
      </Text>
    </View>
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.content, { paddingBottom: scale(60) }]}>
          {/* Back Arrow */}
          <BackButton onPress={handleBack} />

          <View style={{ marginTop: scale(35), alignItems: 'center' }}>
            <Text style={commonStyles.title}>{SIGN_UP.TITLE}</Text>
            <Text style={[commonStyles.subtitle18BlackCentered, { lineHeight: scaleFont(24) }]}>{SIGN_UP.SUBTITLE}</Text>
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

            <View style={[commonStyles.inputContainer]}>
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
                  <Image
                    source={showPassword ? ImagePath.EyeOpen : ImagePath.EyeClosed}
                    style={commonStyles.smallIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={[styles.passwordValidationContainer, { marginBottom: scale(20) }]}>
              <RequirementItem text={SIGN_UP.REQUIREMENT_LENGTH} isValid={passwordRequirements.length} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_UPPERCASE} isValid={passwordRequirements.uppercase} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_LOWERCASE} isValid={passwordRequirements.lowercase} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_NUMBER} isValid={passwordRequirements.number} />
              <RequirementItem text={SIGN_UP.REQUIREMENT_SPECIAL} isValid={passwordRequirements.special} />
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
                  <Image
                    source={showConfirmPassword ? ImagePath.EyeOpen : ImagePath.EyeClosed}
                    style={commonStyles.smallIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
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
  passwordValidationContainer: {
    padding: scale(16),
    paddingHorizontal: scale(20),
  },
  passwordRule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  radioIcon: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    marginRight: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: COLORS.WHITE,
  },
  passwordRuleText: {
    fontSize: scaleFont(14),
    fontFamily: 'varela_round_regular',
    flex: 1,
  },
});

export default SignUp;

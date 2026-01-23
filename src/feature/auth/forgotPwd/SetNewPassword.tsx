import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import { RESET_PASSWORD, ERRORS, COMMON } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';
import { resetPasswordAsync } from '../../../redux/slices/auth/authSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { LoadingModal } from '../../../components/modals';

type SetNewPasswordNavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type SetNewPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

const SetNewPassword: React.FC = () => {
  const navigation = useNavigation<SetNewPasswordNavigationProp>();
  const route = useRoute<SetNewPasswordRouteProp>();
  const { email, token } = route.params;
  const dispatch = useAppDispatch();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSavePassword = async () => {
    if (!password || !confirmPassword) {
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

    setIsLoading(true);

    try {
      await dispatch(resetPasswordAsync({ email, token, newPassword: password })).unwrap();
      setIsLoading(false);
      // Navigate to Password Confirmation screen
      navigation.navigate('PasswordConfirmation');
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage: string = RESET_PASSWORD.RESET_PASSWORD_FAILED_MESSAGE || 'Password reset failed. Please try again.';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      Alert.alert(
        RESET_PASSWORD.RESET_PASSWORD_FAILED_TITLE || 'Reset Password Failed',
        errorMessage,
        [{ text: COMMON.OK, style: 'default' }]
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading}
        message={RESET_PASSWORD.LOADING_MESSAGE || 'Resetting password...'}
      />
      
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.contentTransparent, { paddingBottom: scale(60) }]}>
          {/* Back Arrow */}
          <BackButton onPress={handleBack} />

          <View style={{ marginTop: scale(35), alignItems: 'center' }}>
            <Text style={commonStyles.title}>{RESET_PASSWORD.TITLE}</Text>
            <Text style={[commonStyles.subtitle18BlackCentered, { lineHeight: scaleFont(24) }]}>{RESET_PASSWORD.SUBTITLE}</Text>
          </View>
          <View style={[commonStyles.form, { marginTop: scale(56) }]}>
            <View style={[commonStyles.inputContainer]}>
              <Text style={commonStyles.inputLabel}>{RESET_PASSWORD.PASSWORD_LABEL}</Text>
              <View style={commonStyles.passwordContainer}>
                <TextInput
                  style={commonStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={RESET_PASSWORD.PASSWORD_PLACEHOLDER}
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
              <RequirementItem text={RESET_PASSWORD.REQUIREMENT_LENGTH} isValid={passwordRequirements.length} />
              <RequirementItem text={RESET_PASSWORD.REQUIREMENT_UPPERCASE} isValid={passwordRequirements.uppercase} />
              <RequirementItem text={RESET_PASSWORD.REQUIREMENT_LOWERCASE} isValid={passwordRequirements.lowercase} />
              <RequirementItem text={RESET_PASSWORD.REQUIREMENT_NUMBER} isValid={passwordRequirements.number} />
              <RequirementItem text={RESET_PASSWORD.REQUIREMENT_SPECIAL} isValid={passwordRequirements.special} />
            </View>

            <View style={[commonStyles.inputContainer, { marginBottom: scale(24) }]}>
              <Text style={commonStyles.inputLabel}>{RESET_PASSWORD.CONFIRM_PASSWORD_LABEL}</Text>
              <View style={commonStyles.passwordContainer}>
                <TextInput
                  style={commonStyles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={RESET_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
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
              title={RESET_PASSWORD.SAVE_BUTTON}
              onPress={handleSavePassword}
              disabled={isLoading}
              loading={isLoading}
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

export default SetNewPassword;

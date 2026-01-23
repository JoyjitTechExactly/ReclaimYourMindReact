import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import { SIGN_IN, ERRORS, ICONS, COMMON } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';
import { loginAsync } from '../../../redux/slices/auth/authSlice';
import { LoadingModal } from '../../../components/modals';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

type SignInNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(ERRORS.ERROR_TITLE, ERRORS.FILL_ALL_FIELDS);
      return;
    }
    
    try {
      // Dispatch async thunk - API call is handled in the service layer
      await dispatch(loginAsync({ email, password })).unwrap();
      
      // Login successful - navigation will be handled automatically by RootNavigator
      // based on isAuthenticated state change
      console.log('Login successful for:', email);
    } catch (error: any) {
      // Extract user-friendly error message
      let errorMessage: string = SIGN_IN.LOGIN_FAILED_MESSAGE;
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      // Show user-friendly error alert
      Alert.alert(
        SIGN_IN.LOGIN_FAILED_TITLE,
        errorMessage,
        [{ text: COMMON.OK, style: 'default' }]
      );
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    navigation.navigate('ForgotPassword');
    console.log('Forgot password');
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
        message={SIGN_IN.LOADING_MESSAGE}
      />
      
      <View style={commonStyles.contentTransparent}>
        {/* Back Arrow */}
        <BackButton onPress={handleBack} />

        <View style={{ marginTop: scale(35), alignItems: 'center' }}>
          <Text style={commonStyles.title}>{SIGN_IN.TITLE}</Text>
          <Text style={commonStyles.subtitle18BlackCentered}>{SIGN_IN.SUBTITLE}</Text>
        </View>
        
        <View style={[commonStyles.form, { marginTop: scale(56)}]}>
          <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
            <Text style={commonStyles.inputLabel}>{SIGN_IN.EMAIL_LABEL}</Text>
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={SIGN_IN.EMAIL_PLACEHOLDER}
              placeholderTextColor={COLORS.GRAY}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[commonStyles.inputContainer, { marginBottom: scale(24)}]}>
            <Text style={commonStyles.inputLabel}>{SIGN_IN.PASSWORD_LABEL}</Text>
            <View style={commonStyles.passwordContainer}>
              <TextInput
                style={[commonStyles.input, commonStyles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder={SIGN_IN.PASSWORD_PLACEHOLDER}
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

          <TouchableOpacity style={commonStyles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={commonStyles.forgotPasswordText}>{SIGN_IN.FORGOT_PASSWORD}</Text>
          </TouchableOpacity>

          <CustomButton
            title={SIGN_IN.LOGIN_BUTTON}
            onPress={handleSignIn}
            style={{ marginTop: scale(24) }}
            disabled={isLoading}
            loading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // No custom styles needed - all using commonStyles
});

export default SignIn;

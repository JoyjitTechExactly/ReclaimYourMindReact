import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../utils/scaling';
import BackButton from '../../components/BackButton';
import { SIGN_IN, ERRORS, ICONS } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import { commonStyles } from '../../styles/commonStyles';

type SignInNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', ERRORS.FILL_ALL_FIELDS);
      return;
    }
    // Handle sign in logic here
    console.log('Sign in with:', email, password);
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
      <View style={commonStyles.content}>
        {/* Back Arrow */}
        <BackButton onPress={handleBack} />

        <View style={{ marginTop: scale(35), alignItems: 'center' }}>
          <Text style={commonStyles.title}>{SIGN_IN.TITLE}</Text>
          <Text style={commonStyles.subtitle}>{SIGN_IN.SUBTITLE}</Text>
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

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
import { FORGOT_PASSWORD, ERRORS, SIGN_IN, COMMON } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';
import { forgotPasswordAsync } from '../../../redux/slices/auth/authSlice';
import { LoadingModal } from '../../../components/modals';
import { useAppDispatch } from '../../../redux/hooks';

type ForgotPasswordNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetCode =  async () => {
    if (!email) {
      Alert.alert('Error', ERRORS.FILL_ALL_FIELDS);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(forgotPasswordAsync(email)).unwrap();
      
      // Only navigate to OTP screen on success
      setIsLoading(false);
      navigation.navigate('OTP', { email });
    } catch (error: any) {
      setIsLoading(false);
      
      // Extract user-friendly error message
      let errorMessage: string = FORGOT_PASSWORD.INVALID_EMAIL_MESSAGE;
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      // Show user-friendly error alert
      Alert.alert(
        FORGOT_PASSWORD.FORGOT_PASSWORD_FAILED_TITLE,
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
        message={FORGOT_PASSWORD.LOADING_MESSAGE}
      />
      
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.contentTransparent, { paddingBottom: scale(60) }]}>
          {/* Back Arrow */}
          <BackButton onPress={handleBack} />

          <View style={{ marginTop: scale(35), alignItems: 'center' }}>
            <Text style={commonStyles.title}>{FORGOT_PASSWORD.TITLE}</Text>
            <Text style={[commonStyles.subtitle18BlackCentered, { lineHeight: scaleFont(24) }]}>{FORGOT_PASSWORD.SUBTITLE}</Text>
          </View>

          <View style={[commonStyles.form, { marginTop: scale(56) }]}>
            <View style={[commonStyles.inputContainer, { marginBottom: scale(24) }]}>
              <Text style={commonStyles.inputLabel}>{FORGOT_PASSWORD.EMAIL_LABEL}</Text>
              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
                placeholderTextColor={COLORS.GRAY}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <CustomButton
              title={FORGOT_PASSWORD.SEND_CODE_BUTTON}
              onPress={handleSendResetCode}
              disabled={isLoading}
              loading={isLoading}
              style={{ marginTop: scale(24) }}
            />

            <View style={styles.infoContainer}>
              <Image
                source={ImagePath.Info}
                style={commonStyles.smallIcon}
                resizeMode="contain"
              />
              <Text style={styles.infoText}>{FORGOT_PASSWORD.INFO_TEXT}</Text>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    padding: scale(16),
    paddingHorizontal: scale(20),
    marginTop: scale(40),
  },
  infoText: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    flex: 1,
    marginLeft: scale(12),
    lineHeight: scaleFont(20),
  },
});

export default ForgotPassword;

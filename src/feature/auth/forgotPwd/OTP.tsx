import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import { OTP_CONSTANTS, ERRORS } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';

type OTPNavigationProp = StackNavigationProp<AuthStackParamList, 'OTP'>;
type OTPOuterRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

const OTP: React.FC = () => {
  const navigation = useNavigation<OTPNavigationProp>();
  const route = useRoute<OTPOuterRouteProp>();
  const { email } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = Array(6).fill(0).map(() => React.createRef<TextInput>());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to Reset Password screen
      navigation.navigate('ResetPassword', { email });
    }, 1000);
  };

  const handleResendCode = () => {
    if (!canResend) return;
    
    // Reset timer
    setTimer(45);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    
    // Focus first input
    inputRefs[0].current?.focus();
    
    Alert.alert('Success', 'Code resent successfully');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.contentTransparent, { paddingBottom: scale(60) }]}>
          {/* Back Arrow */}
          <BackButton onPress={handleBack} />

          <View style={{ marginTop: scale(35), alignItems: 'center' }}>
            <Text style={commonStyles.title}>{OTP_CONSTANTS.TITLE}</Text>
            <Text style={[commonStyles.subtitle18BlackCentered, { lineHeight: scaleFont(24), textAlign: 'center' }]}>
              {OTP_CONSTANTS.SUBTITLE}
            </Text>
          </View>

          <View style={[commonStyles.form, { marginTop: scale(56) }]}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry={false}
                  selectTextOnFocus
                />
              ))}
            </View>

            <CustomButton
              title={OTP_CONSTANTS.VERIFY_BUTTON}
              onPress={handleVerifyCode}
              disabled={isLoading}
              style={{ marginTop: scale(24) }}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>{OTP_CONSTANTS.RESEND_TEXT}</Text>
              {!canResend && (
                <Text style={styles.resendCodeText}>
                  Resend code in {formatTime(timer)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emailText: {
    fontSize: scaleFont(16),
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(32),
  },
  otpInput: {
    width: scale(45),
    height: scale(55),
    backgroundColor: COLORS.WHITE,
    borderWidth: scale(2),
    borderColor: COLORS.SECONDARY,
    borderRadius: scale(12),
    fontSize: scaleFont(20),
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
  },
  resendContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    padding: scale(16),
    paddingHorizontal: scale(20),
    marginTop: scale(40),
    alignSelf: 'center',
  },
  resendText: {
    fontSize: scaleFont(14),
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: scale(4),
  },
  resendCodeText: {
    fontSize: scaleFont(14),
    fontFamily: 'varela_round_regular',
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  timerText: {
    fontSize: scaleFont(14),
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default OTP;

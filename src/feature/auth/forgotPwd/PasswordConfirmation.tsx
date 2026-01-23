import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import { PASSWORD_CONFIRMATION } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';

type PasswordConfirmationNavigationProp = StackNavigationProp<AuthStackParamList, 'PasswordConfirmation'>;

const PasswordConfirmation: React.FC = () => {
  const navigation = useNavigation<PasswordConfirmationNavigationProp>();

  // Disable gesture back and hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent back action
      };

      // Disable gesture back
      navigation.setOptions({
        gestureEnabled: false,
      });

      // Disable hardware back button
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
      };
    }, [navigation])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 1,
        routes: [{ name: 'Onboard' }, { name: 'SignIn' }],
      });
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleLogin = () => {
    // Navigate to SignIn with Onboard in the stack
    navigation.reset({
        index: 1,
        routes: [{ name: 'Onboard' }, { name: 'SignIn' }],
      });
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
        <View style={[commonStyles.contentTransparent, { paddingBottom: scale(60) }]}>
          <View style={styles.contentCentered}>
            {/* Success Icon */}
            <Image
              source={ImagePath.CircleCheck}
              style={styles.successIcon}
              resizeMode="contain"
            />

            {/* Success Message */}
            <Text style={styles.title}>{PASSWORD_CONFIRMATION.TITLE}</Text>
            <Text style={styles.subtitle}>{PASSWORD_CONFIRMATION.SUBTITLE}</Text>

            {/* Login Button */}
            <CustomButton
              title={PASSWORD_CONFIRMATION.LOGIN_BUTTON}
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentCentered: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  successIcon: {
    width: scale(100),
    height: scale(100),
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    marginBottom: scale(12),
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: COLORS.GRAY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    lineHeight: scaleFont(24),
    marginBottom: scale(40),
  },
  loginButton: {
    width: '100%',
    maxWidth: scale(300),
  },
});

export default PasswordConfirmation;

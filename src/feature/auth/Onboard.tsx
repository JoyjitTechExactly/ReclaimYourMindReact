import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleHeight, scaleFont, scaleWidth } from '../../utils/scaling';
import { ONBOARDING } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import { commonStyles } from '../../styles/commonStyles';

type OnboardNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboard'>;

const Onboard: React.FC = () => {
  const navigation = useNavigation<OnboardNavigationProp>();

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  const handleLogIn = () => {
    navigation.navigate('SignIn');
  };
  const insets = useSafeAreaInsets();

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <Image
        source={ImagePath.OnboardingHeader}
        style={styles.logoImage}
        resizeMode="cover"
      />
      <View style={commonStyles.contentContainer}>
        <Text style={[commonStyles.titleCentered, { marginBottom: scale(6) }]}>{ONBOARDING.TITLE}</Text>
        <Text style={[commonStyles.subtitleCentered, { marginBottom: scale(16) }]}>{ONBOARDING.SUBTITLE}</Text>

        <Text style={[commonStyles.description, { fontSize: scaleFont(18), fontWeight:600 , marginBottom:0}]}>
          {ONBOARDING.AWARENESS_LINE1}
        </Text>
        <Text style={[commonStyles.description, { marginBottom: scale(36) }]}>{ONBOARDING.AWARENESS_LINE2}</Text>

          <View style={[commonStyles.buttonContainer, { marginBottom: scale(60) }]}>
          <CustomButton
            title={ONBOARDING.CREATE_ACCOUNT}
            onPress={handleCreateAccount}
            style={{marginBottom: scale(20)}}
          />

          <View style={styles.loginSection}>
            <Text style={styles.alreadyHaveAccountText}>{ONBOARDING.ALREADY_HAVE_ACCOUNT}</Text>
            <CustomButton
              title={ONBOARDING.LOG_IN}
              onPress={handleLogIn}
              fullWidth={false}
              variant="login"
            />
          </View>
        </View>
          <View style={commonStyles.privacyContainer}>
            <Image
              source={ImagePath.Security}
              style={commonStyles.smallIcon}
              resizeMode="contain"
            />
            <View style={styles.privacyTextContainer}>
              <Text style={commonStyles.textTiny}>{ONBOARDING.PRIVACY_TEXT_LINE1}</Text>
              <Text style={commonStyles.textTiny}>{ONBOARDING.PRIVACY_TEXT_LINE2}</Text>
            </View>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: '100%',
    height: scaleHeight(312),
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alreadyHaveAccountText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    marginRight: scale(8),
  },
  privacyTextContainer: {
    flex: 1,
  },
});

export default Onboard;

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont, scaleWidth } from '../../../utils/scaling';
import { ONBOARDING } from '../../../constants/strings';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';

type OnboardNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboard'>;

const Onboard: React.FC = () => {
  const navigation = useNavigation<OnboardNavigationProp>();

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  const handleLogIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={[commonStyles.container]}>
      <ScrollView 
        style={commonStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={ImagePath.OnboardingHeader}
          style={styles.logoImage}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={[commonStyles.titleCentered]}>{ONBOARDING.TITLE}</Text>
          <Text style={[commonStyles.subtitle18BlackCentered, { marginTop: scale(6), marginBottom: scale(16) }]}>{ONBOARDING.SUBTITLE}</Text>

          <Text style={[commonStyles.description, { fontSize: scaleFont(16), fontWeight:600 , marginBottom:0}]}>
            {ONBOARDING.AWARENESS_LINE1}
          </Text>
          <Text style={[commonStyles.description, { fontSize: scaleFont(14)}]}>{ONBOARDING.AWARENESS_LINE2}</Text>

            <View style={[commonStyles.buttonContainer, { marginTop: scale(36) }]}>
            <CustomButton
              title={ONBOARDING.CREATE_ACCOUNT}
              onPress={handleCreateAccount}
            />

            <View style={[styles.loginSection, { marginTop: scale(18) }]}>
              <Text style={styles.alreadyHaveAccountText}>{ONBOARDING.ALREADY_HAVE_ACCOUNT}</Text>
              <CustomButton
                title={ONBOARDING.LOG_IN}
                onPress={handleLogIn}
                fullWidth={false}
                variant="login"
              />
            </View>
          </View>
            <View style={[commonStyles.privacyContainer, {marginTop:scale(60), marginBottom: scale(40) }]}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(20),
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(20),
  },
  logoImage: {
    width: '100%',
    height: scaleHeight(310),
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

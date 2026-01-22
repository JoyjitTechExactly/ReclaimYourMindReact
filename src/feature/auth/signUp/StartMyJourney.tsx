import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { SIGN_UP } from '../../../constants/strings';
import { scale, scaleFont, scaleHeight } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import CustomButton from '../../../components/common/CustomButton';
import { commonStyles } from '../../../styles/commonStyles';
import { JOURNEY_STEPS, JourneyStep } from '../../../constants/constantData';

type StartMyJourneyNavigationProp = StackNavigationProp<AuthStackParamList, 'JourneyStart'>;

interface JourneyStepItemProps {
  step: JourneyStep;
  index: number;
  isLast: boolean;
}

const JourneyStepItem: React.FC<JourneyStepItemProps> = ({ step, index, isLast }) => {
  return (
    <View style={[commonStyles.mb28]}>
      <View style={commonStyles.row}>
        <View style={styles.stepIconContainer}>
          <Image source={step.icon} style={styles.stepIcon} />
        </View>
        <View style={[commonStyles.flex1, { paddingTop: scale(4) }]}>
          <Text style={[{ fontSize: scaleFont(16), fontWeight: '600', color: COLORS.PRIMARY, fontFamily: 'varela_round_regular', marginBottom: scale(4) }]}>{step.title}</Text>
          <Text style={[{ fontSize: scaleFont(14), color: COLORS.GRAY, fontFamily: 'varela_round_regular' }]}>{step.description}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.stepConnector} />}
    </View>
  );
};

const StartMyJourney: React.FC = () => {
  const navigation = useNavigation<StartMyJourneyNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    // Navigate directly to JourneyCompletion (SignUpConfirmation)
    navigation.navigate('JourneyCompletion');
  };

  const handleBack = () => {
    // Back → Onboarding page
    navigation.navigate('Onboard');
  };

  const handlePlayVideo = () => {
    // TODO: Implement video modal or navigation
    console.log('Play intro video');
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.TEXT_PRIMARY} />
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section with Dark Background */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <BackButton onPress={handleBack} color={COLORS.WHITE} />
            <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={[styles.contentSection, commonStyles.ph20]}>
          {/* Title and Description */}
          <View style={[commonStyles.mb40]}>
            <Text style={commonStyles.blaclkTitleCentered}>{SIGN_UP.START_JOURNEY.TITLE}</Text>
            <Text style={[commonStyles.subtitleGreyCentered, { marginTop: scale(12) }]}>{SIGN_UP.START_JOURNEY.SUBTITLE}</Text>
          </View>

          {/* Journey Timeline */}
          <View style={[commonStyles.mb40]}>
            {JOURNEY_STEPS.map((step, index) => (
              <JourneyStepItem
                key={step.title}
                step={step}
                index={index}
                isLast={index === JOURNEY_STEPS.length - 1}
              />
            ))}
          </View>

          {/* Start Journey Button */}
          <View style={commonStyles.mb24}>
            <CustomButton
              title={SIGN_UP.START_JOURNEY.GET_STARTED_BUTTON}
              onPress={handleGetStarted}
              variant="primary"
              fullWidth={true}
            />
          </View>

          {/* Footer Reassurance Text */}
          <Text style={[commonStyles.textSmallCentered]}>{SIGN_UP.START_JOURNEY.FOOTER_TEXT}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: COLORS.TEXT_PRIMARY,
    height: scaleHeight(200),
    position: 'relative',
  },
  headerContent: {
    flex: 1,
    paddingTop: scale(20),
    paddingHorizontal: scale(20),
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -scale(30) }, { translateY: -scale(30) }],
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    marginLeft: scale(2),
  },
  contentSection: {
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: scale(40),
    paddingBottom: scale(60),
  },
  stepIconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  stepIcon: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'contain',
  },
  stepConnector: {
    position: 'absolute',
    left: scale(25),
    top: scale(50),
    width: scale(2),
    height: scale(60),
    backgroundColor: COLORS.SECONDARY,
  },
});

export default StartMyJourney;

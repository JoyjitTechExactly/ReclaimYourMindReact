import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { scale, scaleHeight, scaleFont } from '../../../utils/scaling';
import BackButton from '../../../components/common/BackButton';
import { SIGN_UP } from '../../../constants/strings';
import SwipeButton from '../../../components/auth/SwipeButton';
import { commonStyles } from '../../../styles/commonStyles';
import { setAccountCreationComplete } from '../../../redux/slices/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
type SignUpConfirmationNavigationProp = StackNavigationProp<AuthStackParamList, 'JourneyCompletion'>;

const SignUpConfirmation: React.FC = () => {
  const navigation = useNavigation<SignUpConfirmationNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleContinue = () => {
    // Mark account creation flow as complete
    // RootNavigator will automatically switch to App navigator when isAccountCreationComplete is true
    // No manual navigation needed - the conditional rendering in RootNavigator handles the switch
    dispatch(setAccountCreationComplete(true));
  };

  const insets = useSafeAreaInsets();

  // Disable back gesture and hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Set gesture enabled to false for iOS swipe back gesture
      navigation.setOptions({
        gestureEnabled: false,
      });

      return () => {
        subscription.remove();
      };
    }, [navigation])
  );

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* App Logo */}
          <Image
            source={ImagePath.ProfileSuccess}
            style={styles.profileSuccess}
            resizeMode="contain"
          />
          
          {/* Title */}
          <Text style={commonStyles.titleCentered}>{SIGN_UP.CONFIRMATION.TITLE}</Text>

          {/* Subtitle */}
          <Text style={[commonStyles.subtitleCentered, { marginTop: scale(20) }]}>{SIGN_UP.CONFIRMATION.SUBTITLE}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={[commonStyles.subtitleGreyCentered]}>{SIGN_UP.CONFIRMATION.DESCRIPTION}</Text>
        </View>
        
        {/* Footer with Button */}
        <View style={styles.footerContainer}>
          <SwipeButton
            onSwipeComplete={handleContinue}
            text={SIGN_UP.CONFIRMATION.CONTINUE_BUTTON}
          />
          <Text style={styles.subtitleText}>
            Your healing journey begins at your own pace.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(40),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(40),
  },
  profileSuccess: {
    width: scale(80),
    height: scale(80),
    marginTop: scale(80),
    marginBottom: scale(32),
  },
  footerContainer: {
    marginBottom: scale(20),
    paddingHorizontal: scale(20),
    paddingTop: scale(40),
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_SECONDARY,
    marginTop: scale(12),
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: scale(1),
    backgroundColor: COLORS.GRAY,
    borderRadius: scale(2),
    marginVertical: scale(19),
  },
});

export default SignUpConfirmation;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, Switch, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { ERRORS, PROFILE, COMMON } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import { logout, logoutAsync } from '../../redux/slices/auth/authSlice';
import { deleteAccountAsync } from '../../redux/slices/profile/profileSlice';
import DeleteAccountModal from '../../components/modals/DeleteAccountModal';
import { LoadingModal } from '../../components/modals';
import network from '../../utils/network';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import storage from '../../utils/storage';

type ProfileNavigationProp = StackNavigationProp<AppStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { isLoading: isProfileLoading } = useAppSelector((state) => state.profile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  
  // Show loading when any API call is in progress
  const isLoading = isAuthLoading || isProfileLoading;
  
  // Determine loading message based on which operation is in progress
  const getLoadingMessage = () => {
    if (isProfileLoading) {
      return PROFILE.DELETE_ACCOUNT_LOADING_MESSAGE;
    }
    if (isAuthLoading) {
      return PROFILE.LOADING_MESSAGE; // For logout
    }
    return PROFILE.LOADING_MESSAGE;
  };
  // Initialize with user data from Redux or storage
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !user.name || !user.email) {
        try {
          const storedUser = await storage.getUser();
          if (storedUser) {
            setFullName(storedUser.name || '');
            setEmail(storedUser.email || '');
          }
        } catch (error) {
          console.error('Error loading user data from storage:', error);
        }
      } else {
        // Use Redux user data
        setFullName(user.name);
        setEmail(user.email);
      }
    };
    loadUserData();
  }, [user]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = () => {
    Alert.alert(
      PROFILE.LOGOUT_TITLE,
      PROFILE.LOGOUT_MESSAGE,
      [
        { text: PROFILE.CANCEL, style: 'cancel' },
        {
          text: PROFILE.LOGOUT,
          style: 'destructive',
          onPress: async () => {
            // Check internet connection
            const isConnected = await network.isConnected();
            if (!isConnected) {
              Alert.alert(
                ERRORS.NO_INTERNET_CONNECTION,
                ERRORS.NETWORK_ERROR,
                [{ text: COMMON.OK, style: 'default' }]
              );
              return;
            }

            try {
              // Call logout API
              await dispatch(logoutAsync()).unwrap();
              // Logout successful - navigation will be handled automatically by RootNavigator
              // based on isAuthenticated state change
            } catch (error: any) {
              // Extract user-friendly error message
              let errorMessage: string = PROFILE.LOGOUT_FAILED_MESSAGE;

              if (typeof error === 'string') {
                errorMessage = error;
              } else if (error?.message) {
                errorMessage = error.message;
              } else if (error?.error) {
                errorMessage = error.error;
              }

              // Show user-friendly error alert
              Alert.alert(
                PROFILE.LOGOUT_FAILED_TITLE,
                errorMessage,
                [{ text: COMMON.OK, style: 'default' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleExportJournals = () => {
    setShowDeleteModal(false);
    // Implement export journals functionality
    Alert.alert(PROFILE.EXPORT_JOURNALS_TITLE, PROFILE.EXPORT_JOURNALS_MESSAGE);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      await dispatch(deleteAccountAsync()).unwrap();
      dispatch(logout());
    } catch (error: any) {
      let errorMessage: string = PROFILE.DELETE_ACCOUNT_ERROR;
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      Alert.alert(PROFILE.ERROR_TITLE, errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handlePrivacyPolicy = () => {
    // Open privacy policy link
    Linking.openURL('http://54.163.218.252/privacy-policy').catch(() => {
      Alert.alert(PROFILE.ERROR_TITLE, PROFILE.PRIVACY_POLICY_ERROR);
    });
  };

  const handleTermsAndCondition = () => {
    // Open terms and condition link
    Linking.openURL('http://54.163.218.252/terms-of-service').catch(() => {
      Alert.alert(PROFILE.ERROR_TITLE, PROFILE.TERMS_ERROR);
    });
  };

  const renderListItem = (
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    showArrow: boolean = true,
    isLast: boolean = false
  ) => {
    return (
      <TouchableOpacity
        style={[styles.listItem, isLast && styles.listItemLast]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.listItemLeft}>
          <Image source={icon} style={styles.listItemIcon} resizeMode="contain" />
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle}>{title}</Text>
            {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.listItemRight}>
          {rightComponent}
          {showArrow && !rightComponent && (
            <Image source={ImagePath.RightArrow} style={styles.arrowIcon} resizeMode="contain" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading}
        message={getLoadingMessage()}
      />

      {/* User Profile Header */}
      <View style={[commonStyles.fixedHeader, styles.profileHeader]}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Text style={styles.editProfileButtonText}>{PROFILE.EDIT_PROFILE}</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ImageBackground
        source={ImagePath.ScreenBackground}
        style={commonStyles.backgroundImage}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.contentTransparent}>

            {/* Account Section */}
            <View style={[styles.section, { marginTop: scale(20) }]}>
              <Text style={styles.sectionTitle}>{PROFILE.ACCOUNT}</Text>
              <View style={styles.listCard}>
                {renderListItem(
                  ImagePath.KeyIcon,
                  PROFILE.CHANGE_PASSWORD,
                  undefined,
                  handleChangePassword,
                  undefined,
                  true,
                  false
                )}
                {renderListItem(
                  ImagePath.LogoutIcon,
                  PROFILE.LOGOUT,
                  undefined,
                  handleLogout,
                  undefined,
                  true,
                  false
                )}
                {renderListItem(
                  ImagePath.DeleteAccountIcon,
                  PROFILE.DELETE_ACCOUNT,
                  PROFILE.DELETE_ACCOUNT_SUBTITLE,
                  handleDeleteAccount,
                  undefined,
                  true,
                  true
                )}
              </View>
            </View>

            {/* Privacy & Data Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{PROFILE.PRIVACY_DATA}</Text>
              <View style={styles.listCard}>
                {renderListItem(
                  ImagePath.PrivacyPolicyIcon,
                  PROFILE.PRIVACY_POLICY,
                  undefined,
                  handlePrivacyPolicy,
                  undefined,
                  true,
                  false
                )}
                {renderListItem(
                  ImagePath.DocumentIcon,
                  PROFILE.TERMS_AND_CONDITION,
                  undefined,
                  handleTermsAndCondition,
                  undefined,
                  true,
                  true
                )}
              </View>
            </View>

            {/* Allow Notifications */}
            <View style={styles.listCard}>
              <View style={[styles.listItem, styles.listItemLast]}>
                <View style={styles.listItemLeft}>
                  <Image source={ImagePath.Info} style={styles.listItemIcon} resizeMode="contain" />
                  <View style={styles.listItemTextContainer}>
                    <Text style={styles.listItemTitle}>{PROFILE.ALLOW_NOTIFICATIONS}</Text>
                    <Text style={styles.listItemSubtitle}>{PROFILE.NOTIFICATIONS_SUBTITLE}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: COLORS.BORDER_LIGHT, true: COLORS.PRIMARY }}
                    thumbColor={COLORS.WHITE}
                  />
                </View>
              </View>
            </View>

            <View style={{ marginBottom: scale(120) }} />
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onExportJournals={handleExportJournals}
        onConfirmDelete={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
    marginRight: scale(16),
  },
  userName: {
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  userEmail: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  editProfileButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(8),
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(12),
    paddingHorizontal: scale(4),
  },
  listCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    paddingVertical: scale(4),
    ...commonStyles.cardShadow,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(12),
  },
  listItemIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: COLORS.PRIMARY,
    marginRight: scale(12),
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(2),
  },
  listItemSubtitle: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(16),
    marginTop: scale(2),
  },
  listItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: COLORS.PRIMARY,
  },
});

export default ProfileScreen;

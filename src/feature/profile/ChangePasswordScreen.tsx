import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleFont } from '../../utils/scaling';
import Toolbar from '../../components/common/Toolbar';
import { PROFILE, RESET_PASSWORD, ERRORS } from '../../constants/strings';
import CustomButton from '../../components/common/CustomButton';
import { commonStyles } from '../../styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import profileService from '../../network/services/profileService';
import { LoadingModal } from '../../components/modals';
import Toast from 'react-native-toast-message';

type ChangePasswordNavigationProp = StackNavigationProp<AppStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC = () => {
    const navigation = useNavigation<ChangePasswordNavigationProp>();
    const insets = useSafeAreaInsets();

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        return requirements;
    };

    const passwordRequirements = validatePassword(password);

    const RequirementItem: React.FC<{ text: string; isValid: boolean }> = ({ text, isValid }) => (
        <View style={styles.passwordRule}>
            <View style={[styles.radioIcon, {
                backgroundColor: isValid ? COLORS.SUCCESS : 'transparent',
                borderColor: isValid ? COLORS.SUCCESS : COLORS.GRAY
            }]}>
                {isValid && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={[styles.passwordRuleText, { color: isValid ? COLORS.TEXT_PRIMARY : COLORS.GRAY }]}>
                {text}
            </Text>
        </View>
    );

    const handleSavePassword = async () => {
        // Validate current password
        if (!currentPassword) {
            setCurrentPasswordError(PROFILE.INCORRECT_CURRENT_PASSWORD);
            return;
        }

        // Clear previous errors
        setPasswordError('');
        setConfirmPasswordError('');

        if (!password) {
            setPasswordError(ERRORS.FILL_ALL_FIELDS);
            return;
        }

        if (!confirmPassword) {
            setConfirmPasswordError(ERRORS.FILL_ALL_FIELDS);
            return;
        }

        const isValid = Object.values(passwordRequirements).every(Boolean);
        if (!isValid) {
            setPasswordError(ERRORS.PASSWORD_REQUIREMENTS);
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError(ERRORS.PASSWORDS_DO_NOT_MATCH);
            return;
        }

        setIsLoading(true);

        try {
            const response = await profileService.changePassword({
                old_password: currentPassword,
                password: password,
                password_confirmation: confirmPassword,
            });

            setIsLoading(false);

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.message || 'Password changed successfully',
                    position: 'bottom',
                    visibilityTime: 2000,
                });
                // Navigate to Profile screen after a short delay to show the toast
                setTimeout(() => {
                    navigation.navigate('Profile');
                }, 500);
            } else {
                // Handle validation errors
                const errorMessage = response.error || response.message || 'Failed to change password. Please try again.';
                
                // Check if it's a current password error
                if (errorMessage.toLowerCase().includes('current') || errorMessage.toLowerCase().includes('old')) {
                    setCurrentPasswordError(errorMessage);
                } else {
                    Alert.alert('Error', errorMessage);
                }
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleCurrentPasswordChange = (text: string) => {
        setCurrentPassword(text);
        if (currentPasswordError) {
            setCurrentPasswordError('');
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
    };

    return (
        <View style={[commonStyles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: COLORS.WHITE }]}>
            <LoadingModal visible={isLoading} message="Changing password..." />
            <Toolbar
                title={PROFILE.CHANGE_PASSWORD}
                onBackPress={handleBack}
                bottomMargin={30}
                backButtonColor={COLORS.PRIMARY}
            />
            <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={commonStyles.contentDefaultBackground}>
                    <View style={[commonStyles.form]}>
                        {/* Current Password */}
                        <View style={[commonStyles.inputContainer, { marginBottom:scale(16)}] }>
                            <Text style={commonStyles.inputLabel}>{PROFILE.CURRENT_PASSWORD}</Text>
                            {currentPasswordError && (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorDot} />
                                    <Text style={styles.errorText}>{currentPasswordError}</Text>
                                </View>
                            )}
                            <View style={commonStyles.passwordContainer}>
                                <TextInput
                                    style={[commonStyles.input, currentPasswordError && styles.inputError]}
                                    value={currentPassword}
                                    onChangeText={handleCurrentPasswordChange}
                                    placeholder="Enter current password"
                                    placeholderTextColor={COLORS.GRAY}
                                    secureTextEntry={!showCurrentPassword}
                                />
                                <TouchableOpacity
                                    style={commonStyles.eyeIcon}
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <Image
                                        source={showCurrentPassword ? ImagePath.EyeOpen : ImagePath.EyeClosed}
                                        style={commonStyles.smallIcon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={[commonStyles.inputContainer]}>
                            <Text style={commonStyles.inputLabel}>{RESET_PASSWORD.PASSWORD_LABEL}</Text>
                            {passwordError && (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorDot} />
                                    <Text style={styles.errorText}>{passwordError}</Text>
                                </View>
                            )}
                            <View style={commonStyles.passwordContainer}>
                                <TextInput
                                    style={[commonStyles.input, passwordError && styles.inputError]}
                                    value={password}
                                    onChangeText={handlePasswordChange}
                                    placeholder={RESET_PASSWORD.PASSWORD_PLACEHOLDER}
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

                        {/* Password Requirements */}
                        <View style={[styles.passwordValidationContainer, { marginBottom: scale(20) }]}>
                            <RequirementItem text={RESET_PASSWORD.REQUIREMENT_LENGTH} isValid={passwordRequirements.length} />
                            <RequirementItem text={RESET_PASSWORD.REQUIREMENT_UPPERCASE} isValid={passwordRequirements.uppercase} />
                            <RequirementItem text={RESET_PASSWORD.REQUIREMENT_LOWERCASE} isValid={passwordRequirements.lowercase} />
                            <RequirementItem text={RESET_PASSWORD.REQUIREMENT_NUMBER} isValid={passwordRequirements.number} />
                            <RequirementItem text={RESET_PASSWORD.REQUIREMENT_SPECIAL} isValid={passwordRequirements.special} />
                        </View>

                        {/* Confirm Password */}
                        <View style={[commonStyles.inputContainer, { marginBottom: scale(24) }]}>
                            <Text style={commonStyles.inputLabel}>{RESET_PASSWORD.CONFIRM_PASSWORD_LABEL}</Text>
                            {confirmPasswordError && (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorDot} />
                                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                                </View>
                            )}
                            <View style={commonStyles.passwordContainer}>
                                <TextInput
                                    style={[commonStyles.input, confirmPasswordError && styles.inputError]}
                                    value={confirmPassword}
                                    onChangeText={handleConfirmPasswordChange}
                                    placeholder={RESET_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
                                    placeholderTextColor={COLORS.GRAY}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={commonStyles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Image
                                        source={showConfirmPassword ? ImagePath.EyeOpen : ImagePath.EyeClosed}
                                        style={commonStyles.smallIcon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <CustomButton
                            title={PROFILE.SAVE_NEW_PASSWORD}
                            onPress={handleSavePassword}
                            disabled={isLoading}
                            style={{ marginTop: scale(24) }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    passwordValidationContainer: {
        padding: scale(16),
        paddingHorizontal: scale(20),
    },
    passwordRule: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    radioIcon: {
        width: scale(16),
        height: scale(16),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: COLORS.GRAY,
        marginRight: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInnerCircle: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: COLORS.WHITE,
    },
    passwordRuleText: {
        fontSize: scaleFont(14),
        fontFamily: 'varela_round_regular',
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    errorDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: COLORS.ERROR,
        marginRight: scale(8),
    },
    errorText: {
        fontSize: scaleFont(14),
        color: COLORS.ERROR,
        fontFamily: 'varela_round_regular',
    },
    inputError: {
        borderColor: COLORS.ERROR,
    },
});

export default ChangePasswordScreen;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { PROFILE, COMMON } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { AppStackParamList } from '../../navigators/types';
import Toolbar from '../../components/common/Toolbar';
import AuthInput from '../../components/auth/AuthInput';
import CustomButton from '../../components/common/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateProfileAsync } from '../../redux/slices/profile/profileSlice';
import { LoadingModal } from '../../components/modals';
import storage from '../../utils/storage';

type EditProfileNavigationProp = StackNavigationProp<AppStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
    const navigation = useNavigation<EditProfileNavigationProp>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { isLoading, error } = useAppSelector((state) => state.profile);
    const insets = useSafeAreaInsets();

    // Initialize with user data from Redux or storage
    const [fullName, setFullName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Load user data from storage on mount if Redux doesn't have it
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
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            await dispatch(updateProfileAsync({ 
                name: fullName.trim(), 
                email: email.trim() 
            })).unwrap();
            
            // Success - navigate back
            navigation.goBack();
        } catch (error: any) {
            // Extract user-friendly error message
            let errorMessage: string = PROFILE.UPDATE_PROFILE_FAILED_MESSAGE || 'Profile update failed. Please try again.';
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.error) {
                errorMessage = error.error;
            }
            
            // Show user-friendly error alert
            Alert.alert(
                PROFILE.UPDATE_PROFILE_FAILED_TITLE || 'Update Profile Failed',
                errorMessage,
                [{ text: COMMON.OK, style: 'default' }]
            );
        }
    };

    return (
        <View style={[commonStyles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: COLORS.WHITE }]}>
            {/* Loading Modal */}
            <LoadingModal
                visible={isLoading}
                message={PROFILE.LOADING_MESSAGE || 'Updating profile...'}
            />

            {/* Toolbar */}
            <Toolbar
                title={PROFILE.EDIT_PROFILE}
                onBackPress={handleBack}
                bottomMargin={30}
                backButtonColor={COLORS.PRIMARY}
            />
            <View style={commonStyles.contentDefaultBackground}>
                <View style={[commonStyles.form]}>
                    {/* Full Name Input */}
                    <AuthInput
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        autoCapitalize="words"
                    />

                    {/* Email Input */}
                    <AuthInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email will not be changed"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.inputDisabled}
                    />

                    {/* Save Button */}
                    <CustomButton
                        title="Save"
                        onPress={handleSave}
                        disabled={!fullName.trim() || isLoading}
                        loading={isLoading}
                        style={{ marginTop: scale(24) }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputDisabled: {
        borderWidth: 1,
        borderColor: COLORS.GRAY,
        borderRadius: scale(10),
        padding: scale(16),
        fontSize: scaleFont(16),
        backgroundColor: COLORS.BACKGROUND,
        color: COLORS.TEXT_MUTED,
        opacity: 0.7,
        fontFamily: 'varela_round_regular',
    },
});

export default EditProfileScreen;


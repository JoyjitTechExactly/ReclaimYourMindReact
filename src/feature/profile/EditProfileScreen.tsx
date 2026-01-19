import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { PROFILE } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { AppStackParamList } from '../../navigators/types';
import Toolbar from '../../components/common/Toolbar';
import AuthInput from '../../components/auth/AuthInput';
import CustomButton from '../../components/common/CustomButton';

type EditProfileNavigationProp = StackNavigationProp<AppStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
    const navigation = useNavigation<EditProfileNavigationProp>();
    const [fullName, setFullName] = useState('Sarah Johnson');
    const [email, setEmail] = useState('sarah.johnson@email.com');

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSave = () => {
        if (fullName.trim()) {
            // Here you would save to your data store
            // For now, just navigate back
            navigation.goBack();
        }
    };

    return (
        <View style={[commonStyles.container]}>
            {/* Toolbar */}
            <Toolbar
                title={PROFILE.EDIT_PROFILE}
                onBackPress={handleBack}
                bottomMargin={30}
                backButtonColor={COLORS.PRIMARY}
            />
            <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
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

                        {/* Email Input (Read-only) */}
                        <AuthInput
                            label="Email"
                            value={email}
                            editable={false}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.inputDisabled}
                        />

                        {/* Save Button */}
                        <CustomButton
                            title="Save"
                            onPress={handleSave}
                            disabled={!fullName.trim()}
                            style={{ marginTop: scale(24) }}
                        />
                    </View>
                </View>
            </ScrollView>
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


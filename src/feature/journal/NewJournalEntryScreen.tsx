import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import Toolbar from '../../components/common/Toolbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createJournalAsync } from '../../redux/slices/journal/journalSlice';
import Toast from 'react-native-toast-message';
import { LoadingModal } from '../../components/modals';

type NewJournalEntryNavigationProp = StackNavigationProp<AppStackParamList, 'NewJournalEntry'>;

const NewJournalEntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NewJournalEntryNavigationProp>();
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');

  // Redux state
  const { isCreatingJournal } = useAppSelector((state) => state.journal);

  const handleSave = async () => {
    if (content.trim() && !isCreatingJournal) {
      try {
        await dispatch(createJournalAsync(content.trim())).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Journal entry saved successfully',
          position: 'bottom',
          visibilityTime: 2000,
        });
        navigation.goBack();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error || 'Failed to save journal entry',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleBack = () => {
    if (!isCreatingJournal) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: COLORS.BACKGROUND }}
    >
      <View style={[styles.container]}>
        {/* Loading Modal */}
        <LoadingModal
          visible={isCreatingJournal}
          message="Saving journal entry..."
        />

        {/* Header */}
        <Toolbar
          title={JOURNAL.JOURNAL_ENTRIES}
          onBackPress={handleBack}
          bottomMargin={30}
          backButtonColor={COLORS.PRIMARY}
          backgroundColor={COLORS.BACKGROUND}
        />

        {/* Content */}
        <View style={[styles.contentWrapper, isCreatingJournal && styles.contentDisabled]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder={JOURNAL.WRITE_THOUGHTS}
                placeholderTextColor={COLORS.TEXT_MUTED}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                autoFocus
                editable={!isCreatingJournal}
              />
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[styles.saveButton, (!content.trim() || isCreatingJournal) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!content.trim() || isCreatingJournal}
            >
              {isCreatingJournal ? (
                <View style={styles.saveButtonContent}>
                  <ActivityIndicator size="small" color={COLORS.WHITE} />
                  <Text style={[styles.saveButtonText, { marginLeft: scale(8) }]}>Saving...</Text>
                </View>
              ) : (
                <Text style={[styles.saveButtonText, !content.trim() && styles.saveButtonTextDisabled]}>
                  {JOURNAL.SAVE_ENTRY}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.privacyContainer}>
              <Image source={ImagePath.LockIcon} style={styles.lockIcon} resizeMode="contain" />
              <Text style={styles.privacyText}>Your journal entries are private and secure. Only you can see what you write here.</Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: scale(24),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: scale(20),
  },
  inputCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    padding: scale(16),
    minHeight: scale(400),
    ...commonStyles.cardShadow,
  },
  textInput: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(24),
    flex: 1,
    textAlignVertical: 'top',
  },
  bottomContainer: {
    paddingTop: scale(16),
    paddingBottom: scale(24),
    backgroundColor: COLORS.BACKGROUND,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(12),
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(16),
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.BORDER_LIGHT,
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
  },
  saveButtonTextDisabled: {
    color: COLORS.TEXT_DARK,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
    marginTop: scale(8),
  },
  lockIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: COLORS.TEXT_MUTED,
    marginTop: scale(2),
  },
  privacyText: {
    flex: 1,
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(18),
  },
  contentDisabled: {
    opacity: 0.8,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewJournalEntryScreen;


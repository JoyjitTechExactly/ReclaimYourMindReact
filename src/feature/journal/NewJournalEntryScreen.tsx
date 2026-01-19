import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import Toolbar from '../../components/common/Toolbar';

type NewJournalEntryNavigationProp = StackNavigationProp<AppStackParamList, 'NewJournalEntry'>;

const NewJournalEntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NewJournalEntryNavigationProp>();
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      // Here you would save to your data store
      // For now, just navigate back
      navigation.goBack();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container]}>
        {/* Header */}
        <Toolbar 
          title={JOURNAL.JOURNAL_ENTRIES} 
          onBackPress={handleBack} 
          bottomMargin={30} 
          backButtonColor={COLORS.PRIMARY} 
          backgroundColor={COLORS.BACKGROUND}
        />

        {/* Content */}
        <View style={styles.contentWrapper}>
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
              />
            </View>
          </ScrollView>
          
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!content.trim()}
            >
              <Text style={[styles.saveButtonText, !content.trim() && styles.saveButtonTextDisabled]}>
                {JOURNAL.SAVE_ENTRY}
              </Text>
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
});

export default NewJournalEntryScreen;


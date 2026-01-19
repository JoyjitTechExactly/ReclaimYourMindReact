import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';

type NewJournalEntryNavigationProp = StackNavigationProp<AppStackParamList, 'NewJournalEntry'>;

const NewJournalEntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NewJournalEntryNavigationProp>();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

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

  // Auto-generate title from first line of content
  const getTitle = () => {
    if (title) return title;
    const firstLine = content.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine || 'Untitled Entry';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Fixed Header Section */}
        <View style={[commonStyles.fixedHeader, { paddingBottom: scale(20) }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Image source={ImagePath.BackArrow} style={styles.backIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={[commonStyles.headerTitle, { color: COLORS.PRIMARY, marginBottom: scale(8) }]}>{JOURNAL.JOURNAL_ENTRIES}</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.privacyText}>{JOURNAL.PRIVACY_MESSAGE}</Text>
          <View style={styles.privacyContainer}>
            <Image source={ImagePath.LockIcon} style={[styles.lockIcon, { tintColor: COLORS.GRAY }]} resizeMode="contain" />
            <Text style={styles.privacySubtext}>{JOURNAL.PRIVACY_SUBTITLE}</Text>
          </View>
        </View>

        {/* Content */}
        <ImageBackground
          source={ImagePath.ScreenBackground}
          style={commonStyles.backgroundImage}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={commonStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={commonStyles.contentTransparent}>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Entry Title (optional)"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
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
              <TouchableOpacity
                style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!content.trim()}
              >
                <Text style={styles.saveButtonText}>{JOURNAL.SAVE_ENTRY}</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimer}>{JOURNAL.PRIVACY_DISCLAIMER}</Text>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  backButton: {
    padding: scale(8),
    marginLeft: scale(-8),
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: COLORS.PRIMARY,
  },
  placeholder: {
    width: scale(40),
  },
  privacyContainer: {
    marginTop: scale(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  privacyText: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(2),
  },
  privacySubtext: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  lockIcon: {
    height: scale(14),
    width: scale(14),
  },
  inputCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    ...commonStyles.cardShadow,
  },
  titleInput: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  textInput: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    minHeight: scale(300),
    lineHeight: scaleFont(24),
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
  disclaimer: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    lineHeight: scaleFont(18),
  },
});

export default NewJournalEntryScreen;


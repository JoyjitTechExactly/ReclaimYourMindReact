import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import { sampleJournalEntries } from '../../constants/constantData';

type EditJournalEntryRouteProp = RouteProp<AppStackParamList, 'EditJournalEntry'>;
type EditJournalEntryNavigationProp = StackNavigationProp<AppStackParamList, 'EditJournalEntry'>;

const EditJournalEntryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<EditJournalEntryNavigationProp>();
  const route = useRoute<EditJournalEntryRouteProp>();
  const { entryId } = route.params;

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Find the entry
    const entry = sampleJournalEntries.find(e => e.id === entryId);
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entryId]);

  const handleSave = () => {
    if (content.trim()) {
      // Here you would update your data store
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={ImagePath.BackArrow} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{JOURNAL.EDIT}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ImageBackground
          source={ImagePath.ScreenBackground}
          style={commonStyles.backgroundImage}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <TextInput
                style={styles.titleInput}
                placeholder="Entry Title"
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
              />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_HEADER,
    backgroundColor: COLORS.WHITE,
  },
  backButton: {
    padding: scale(8),
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: COLORS.PRIMARY,
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  placeholder: {
    width: scale(40),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(24),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
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
    marginBottom: scale(24),
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

export default EditJournalEntryScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import { sampleJournalEntries, JournalEntry } from '../../constants/constantData';
import Toolbar from '../../components/common/Toolbar';

type JournalEntryDetailRouteProp = RouteProp<AppStackParamList, 'JournalEntryDetail'>;
type JournalEntryDetailNavigationProp = StackNavigationProp<AppStackParamList, 'JournalEntryDetail'>;

const JournalEntryDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<JournalEntryDetailNavigationProp>();
  const route = useRoute<JournalEntryDetailRouteProp>();
  const { entryId, editMode } = route.params;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const found = sampleJournalEntries.find(e => e.id === entryId);
    if (found) {
      setEntry(found);
      setEditedContent(found.content);
    }
  }, [entryId]);

  useEffect(() => {
    if (editMode) {
      setIsEditing(true);
    }
  }, [editMode]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim() && entry) {
      // Here you would save to your data store
      setEntry({ ...entry, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (entry) {
      setEditedContent(entry.content);
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    if (entry) {
      // Implement download functionality
      Alert.alert(
        'Download PDF',
        `Downloading journal entry from ${entry.date}...`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Here you would delete from your data store
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!entry) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <Toolbar title={JOURNAL.JOURNAL_ENTRIES} onBackPress={handleBack} backButtonColor={COLORS.PRIMARY} />

      <View style={commonStyles.contentDefaultBackground}>
        <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View>
            {/* Journal Entry Card */}
            <View style={styles.entryCard}>
              <Text style={styles.entryDate}>{entry.date}, {entry.time}</Text>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{JOURNAL.YOUR_REFLECTION}</Text>
                {!isEditing && (
                  <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <Image source={ImagePath.EditIcon} style={styles.editIcon} resizeMode="contain" />
                  </TouchableOpacity>
                )}
              </View>

              {isEditing ? (
                <>
                  <TextInput
                    style={styles.contentInput}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    multiline
                    textAlignVertical="top"
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveButton, !editedContent.trim() && styles.saveButtonDisabled]}
                      onPress={handleSave}
                      disabled={!editedContent.trim()}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.entryContent}>{entry.content}</Text>
              )}
            </View>
            <View style={commonStyles.mb60} />
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons - Fixed at Bottom */}
      <View style={[styles.actionButtonsContainer, { paddingBottom: insets.bottom + scale(24) }]}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Text style={styles.downloadButtonText}>{JOURNAL.DOWNLOAD_PDF}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>{JOURNAL.DELETE_ENTRY}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: scale(120),
  },
  entryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(16),
    marginTop: scale(20),
    ...commonStyles.cardShadow,
  },
  entryDate: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  editButton: {
    padding: scale(4),
  },
  editIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: COLORS.TEXT_DARK,
  },
  entryContent: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(24),
  },
  contentInput: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(24),
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    padding: scale(16),
    minHeight: scale(150),
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    marginBottom: scale(12),
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center',
    marginRight: scale(12),
  },
  cancelButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center',
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
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: scale(24),
    paddingTop: scale(16),
    gap: scale(12),
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(12),
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.ERROR,
    borderRadius: scale(12),
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
  },
});

export default JournalEntryDetailScreen;


import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import type { JournalEntry } from '../../constants/constantData';
import Toolbar from '../../components/common/Toolbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchJournalsAsync, updateJournalAsync, deleteJournalAsync, downloadJournalPDFAsync } from '../../redux/slices/journal/journalSlice';
import { JournalEntry as ApiJournalEntry } from '../../network/services/journalService';
import Toast from 'react-native-toast-message';
import { LoadingModal } from '../../components/modals';

type JournalEntryDetailRouteProp = RouteProp<AppStackParamList, 'JournalEntryDetail'>;
type JournalEntryDetailNavigationProp = StackNavigationProp<AppStackParamList, 'JournalEntryDetail'>;

/**
 * Parse date string from API format "28 Jan 2026, 11:19 AM" to separate date and time
 */
const parseApiDate = (dateString: string): { date: string; time: string } => {
  try {
    const parts = dateString.split(', ');
    if (parts.length === 2) {
      return {
        date: parts[0],
        time: parts[1],
      };
    }
    return { date: dateString, time: '' };
  } catch (error) {
    return { date: dateString, time: '' };
  }
};

/**
 * Transform API journal entry to component format
 */
const transformJournalEntry = (apiEntry: ApiJournalEntry): JournalEntry => {
  const { date, time } = parseApiDate(apiEntry.created_at);
  return {
    id: apiEntry.id.toString(),
    title: '',
    content: apiEntry.content,
    date,
    time,
    createdAt: new Date(apiEntry.created_at),
  };
};

const JournalEntryDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<JournalEntryDetailNavigationProp>();
  const route = useRoute<JournalEntryDetailRouteProp>();
  const { entryId, editMode } = route.params;
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Redux state
  const { journals, isLoadingJournals, isUpdatingJournal, isDeletingJournal, isDownloadingJournalPDF } = useAppSelector((state) => state.journal);

  // Transform and find the entry
  const journalEntries = useMemo(() => journals.map(transformJournalEntry), [journals]);
  const entry = useMemo(() => journalEntries.find(e => e.id === entryId) || null, [journalEntries, entryId]);

  // Fetch journals if not loaded
  useEffect(() => {
    if (journals.length === 0 && !isLoadingJournals) {
      dispatch(fetchJournalsAsync());
    }
  }, [dispatch, journals.length, isLoadingJournals]);

  // Set edited content when entry is found
  useEffect(() => {
    if (entry) {
      setEditedContent(entry.content);
    }
  }, [entry]);

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

  const handleSave = async () => {
    if (editedContent.trim() && entry) {
      try {
        const journalId = parseInt(entry.id, 10);
        await dispatch(updateJournalAsync({ journalId, content: editedContent.trim() })).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Journal entry updated successfully',
          position: 'bottom',
          visibilityTime: 3000,
        });
        setIsEditing(false);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error || 'Failed to update journal entry',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleCancel = () => {
    if (entry) {
      setEditedContent(entry.content);
      setIsEditing(false);
    }
  };

  const handleDownload = async () => {
    if (entry) {
      try {
        const journalId = parseInt(entry.id, 10);
        const result = await dispatch(downloadJournalPDFAsync(journalId)).unwrap();
        
        if (result.pdfUrl) {
          const canOpen = await Linking.canOpenURL(result.pdfUrl);
          if (canOpen) {
            await Linking.openURL(result.pdfUrl);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Opening PDF in browser...',
              position: 'bottom',
              visibilityTime: 2000,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Cannot open PDF URL',
              position: 'bottom',
              visibilityTime: 3000,
            });
          }
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error || 'Failed to download PDF',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
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
          onPress: async () => {
            if (entry) {
              try {
                const journalId = parseInt(entry.id, 10);
                await dispatch(deleteJournalAsync(journalId)).unwrap();
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Journal entry deleted successfully',
                  position: 'bottom',
                  visibilityTime: 3000,
                });
                navigation.goBack();
              } catch (error: any) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: error || 'Failed to delete journal entry',
                  position: 'bottom',
                  visibilityTime: 3000,
                });
              }
            }
          },
        },
      ]
    );
  };

  // Only show LoadingModal for save/update operation (like save functionality)
  const isLoading = isUpdatingJournal;

  // Get loading message
  const getLoadingMessage = () => {
    if (isUpdatingJournal) return 'Updating...';
    return 'Loading...';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading}
        message={getLoadingMessage()}
      />

      {/* Header */}
      <Toolbar title={JOURNAL.JOURNAL_ENTRIES} onBackPress={handleBack} backButtonColor={COLORS.PRIMARY} />

      <View style={[commonStyles.contentDefaultBackground, isLoading && styles.contentDisabled]}>
        <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View>
            {/* Journal Entry Card */}
            <View style={styles.entryCard}>
              <Text style={styles.entryDate}>{entry?.date}, {entry?.time}</Text>

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
                      style={[styles.saveButton, (!editedContent.trim() || isUpdatingJournal) && styles.saveButtonDisabled]}
                      onPress={handleSave}
                      disabled={!editedContent.trim() || isUpdatingJournal}
                    >
                      <Text style={styles.saveButtonText}>
                        {isUpdatingJournal ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.entryContent}>{entry?.content}</Text>
              )}
            </View>
            <View style={commonStyles.mb60} />
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons - Fixed at Bottom */}
      <View style={[styles.actionButtonsContainer, { paddingBottom: insets.bottom + scale(24) }]}>
        <TouchableOpacity
          style={[styles.downloadButton, isDownloadingJournalPDF && styles.downloadButtonDisabled]}
          onPress={handleDownload}
          disabled={isDownloadingJournalPDF}
        >
          <Text style={styles.downloadButtonText}>
            {isDownloadingJournalPDF ? 'Downloading...' : JOURNAL.DOWNLOAD_PDF}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, isDeletingJournal && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={isDeletingJournal}
        >
          <Text style={styles.deleteButtonText}>
            {isDeletingJournal ? 'Deleting...' : JOURNAL.DELETE_ENTRY}
          </Text>
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
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  contentDisabled: {
    opacity: 0.5,
  },
});

export default JournalEntryDetailScreen;


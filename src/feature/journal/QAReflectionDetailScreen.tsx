import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, useWindowDimensions, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import type { QAReflection } from '../../constants/constantData';
import Toolbar from '../../components/common/Toolbar';
import HtmlRenderer from '../../components/common/HtmlRenderer';
import JourneyTags from '../../components/home/journey/JourneyTags';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchReflectionsAsync, updateReflectionAsync, deleteReflectionAsync, downloadReflectionPDFAsync } from '../../redux/slices/journal/journalSlice';
import { ReflectionEntry } from '../../network/services/journalService';
import Toast from 'react-native-toast-message';
import { LoadingModal } from '../../components/modals';

type QAReflectionDetailRouteProp = RouteProp<AppStackParamList, 'QAReflectionDetail'>;
type QAReflectionDetailNavigationProp = StackNavigationProp<AppStackParamList, 'QAReflectionDetail'>;

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
 * Transform API reflection entry to component format
 */
const transformReflectionEntry = (apiEntry: ReflectionEntry): QAReflection => {
  const { date, time } = parseApiDate(apiEntry.created_at);
  return {
    id: apiEntry.id.toString(),
    focusOfAdvice: apiEntry.topic_title,
    date,
    time,
    questions: apiEntry.reflection_question ? [apiEntry.reflection_question] : [],
    reflection: apiEntry.reflection_text,
    createdAt: new Date(apiEntry.created_at),
    tag: apiEntry.phase_name,
  };
};

const QAReflectionDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<QAReflectionDetailNavigationProp>();
  const route = useRoute<QAReflectionDetailRouteProp>();
  const { reflectionId, editMode } = route.params;
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editedReflection, setEditedReflection] = useState('');

  // Redux state
  const { reflections, isLoadingReflections, isUpdatingReflection, isDeletingReflection, isDownloadingReflectionPDF } = useAppSelector((state) => state.journal);

  // Transform and find the reflection
  const qaReflections = useMemo(() => reflections.map(transformReflectionEntry), [reflections]);
  const reflection = useMemo(() => qaReflections.find(r => r.id === reflectionId) || null, [qaReflections, reflectionId]);

  // Fetch reflections if not loaded
  useEffect(() => {
    if (reflections.length === 0 && !isLoadingReflections) {
      dispatch(fetchReflectionsAsync());
    }
  }, [dispatch, reflections.length, isLoadingReflections]);

  // Set edited reflection when reflection is found
  useEffect(() => {
    if (reflection) {
      setEditedReflection(reflection.reflection);
    }
  }, [reflection]);

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
    if (editedReflection.trim() && reflection) {
      try {
        const reflectionId = parseInt(reflection.id, 10);
        await dispatch(updateReflectionAsync({ reflectionId, reflectionText: editedReflection.trim() })).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Reflection updated successfully',
          position: 'bottom',
          visibilityTime: 3000,
        });
        setIsEditing(false);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error || 'Failed to update reflection',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleCancel = () => {
    setEditedReflection(reflection?.reflection || '');
    setIsEditing(false);
  };

  const handleDownloadPDF = async () => {
    if (reflection) {
      try {
        const reflectionId = parseInt(reflection.id, 10);
        const result = await dispatch(downloadReflectionPDFAsync(reflectionId)).unwrap();
        
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
      'Are you sure you want to delete this reflection? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (reflection) {
              try {
                const reflectionId = parseInt(reflection.id, 10);
                await dispatch(deleteReflectionAsync(reflectionId)).unwrap();
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Reflection deleted successfully',
                  position: 'bottom',
                  visibilityTime: 3000,
                });
                navigation.goBack();
              } catch (error: any) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: error || 'Failed to delete reflection',
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

  if (isLoadingReflections || !reflection) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  // Only show LoadingModal for save/update operation (like save functionality)
  const isLoading = isUpdatingReflection;

  // Get loading message
  const getLoadingMessage = () => {
    if (isUpdatingReflection) return 'Updating...';
    return 'Loading...';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading}
        message={getLoadingMessage()}
      />

      {/* Header */}
      <Toolbar title={JOURNAL.QA_REFLECTIONS}
        onBackPress={handleBack}
        bottomMargin={30}
        backButtonColor={COLORS.PRIMARY} />

      <View style={[commonStyles.contentDefaultBackground, isLoading && styles.contentDisabled]}>
        <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: scale(120) }}>
            {/* Card 1: Entry Metadata */}
            <View style={styles.entryCard}>
              <View style={styles.metadataHeader}>
                <Text style={styles.entryTitle}>{reflection.focusOfAdvice}</Text>
                <JourneyTags stepType={reflection.tag || ''} />
              </View>
              <Text style={styles.entryDate}>{reflection.date}, {reflection.time}</Text>
            </View>

            {/* Card 2: Reflection Questions */}
            <View style={styles.entryCard}>
              <Text style={styles.sectionTitle}>{JOURNAL.REFLECTION_QUESTIONS}</Text>
              {reflection.questions.map((question: string, index: number) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <View style={styles.questionTextContainer}>
                    <HtmlRenderer
                      html={question}
                      contentWidth={width - scale(112)}
                      textColor={COLORS.TEXT_DARK}
                      fontSize={scaleFont(16)}
                      lineHeight={scaleFont(24)}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Card 3: Your Reflection */}
            <View style={styles.entryCard}>
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
                    style={styles.reflectionInput}
                    value={editedReflection}
                    onChangeText={setEditedReflection}
                    multiline
                    textAlignVertical="top"
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveButton, (!editedReflection.trim() || isUpdatingReflection) && styles.saveButtonDisabled]}
                      onPress={handleSave}
                      disabled={!editedReflection.trim() || isUpdatingReflection}
                    >
                      <Text style={styles.saveButtonText}>
                        {isUpdatingReflection ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.reflectionText}>{reflection.reflection}</Text>
              )}
            </View>
            <View style={commonStyles.mb60} />
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons - Fixed at Bottom */}
      <View style={[styles.actionButtonsContainer, { paddingBottom: insets.bottom + scale(24) }]}>
        <TouchableOpacity
          style={[styles.downloadButton, isDownloadingReflectionPDF && styles.downloadButtonDisabled]}
          onPress={handleDownloadPDF}
          disabled={isDownloadingReflectionPDF}
        >
          <Text style={styles.downloadButtonText}>
            {isDownloadingReflectionPDF ? 'Downloading...' : JOURNAL.DOWNLOAD_PDF}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, isDeletingReflection && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={isDeletingReflection}
        >
          <Text style={styles.deleteButtonText}>
            {isDeletingReflection ? 'Deleting...' : JOURNAL.DELETE_ENTRY}
          </Text>
        </TouchableOpacity>
      </View>
    </View >
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
    textDecorationLine: 'underline',
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
    marginBottom: scale(16),
    ...commonStyles.cardShadow,
  },
  metadataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(12),
    flexWrap: 'wrap',
  },
  entryTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    flex: 1,
    marginRight: scale(8),
  },
  entryDate: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: scale(16),
  },
  questionNumber: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginRight: scale(8),
    minWidth: scale(24),
  },
  questionTextContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(24),
  },
  reflectionText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(24),
  },
  reflectionInput: {
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
  editButton: {
    padding: scale(4),
  },
  editIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: COLORS.TEXT_DARK,
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
  toggleContainer: {
    marginBottom: scale(16),
    marginHorizontal: scale(24),
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

export default QAReflectionDetailScreen;


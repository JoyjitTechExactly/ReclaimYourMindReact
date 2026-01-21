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
import { sampleQAReflections, QAReflection } from '../../constants/constantData';
import Toolbar from '../../components/common/Toolbar';
import JourneyTags from '../../components/common/home/journey/JourneyTags';

type QAReflectionDetailRouteProp = RouteProp<AppStackParamList, 'QAReflectionDetail'>;
type QAReflectionDetailNavigationProp = StackNavigationProp<AppStackParamList, 'QAReflectionDetail'>;

const QAReflectionDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<QAReflectionDetailNavigationProp>();
  const route = useRoute<QAReflectionDetailRouteProp>();
  const { reflectionId, editMode } = route.params;

  const [reflection, setReflection] = useState<QAReflection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReflection, setEditedReflection] = useState('');

  useEffect(() => {
    const found = sampleQAReflections.find(r => r.id === reflectionId);
    if (found) {
      setReflection(found);
      setEditedReflection(found.reflection);
    }
  }, [reflectionId]);

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
    if (editedReflection.trim()) {
      // Here you would save to your data store
      setReflection({ ...reflection, reflection: editedReflection });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedReflection(reflection?.reflection || '');
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    // Here you would implement PDF generation
    Alert.alert('Download PDF', 'PDF download functionality will be implemented here.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this reflection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!reflection) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Toolbar title={JOURNAL.QA_REFLECTIONS}
        onBackPress={handleBack}
        bottomMargin={30}
        backButtonColor={COLORS.PRIMARY} />
      <View style={commonStyles.contentDefaultBackground}>
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
                  <Text style={styles.questionText}>{question}</Text>
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
                      style={[styles.saveButton, !editedReflection.trim() && styles.saveButtonDisabled]}
                      onPress={handleSave}
                      disabled={!editedReflection.trim()}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
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
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
          <Text style={styles.downloadButtonText}>{JOURNAL.DOWNLOAD_PDF}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>{JOURNAL.DELETE_ENTRY}</Text>
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
  questionText: {
    flex: 1,
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
});

export default QAReflectionDetailScreen;


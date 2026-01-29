import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { 
  fetchTopicDetailsAsync, 
  saveReflectionAsync, 
  downloadPDFAsync, 
  markTopicCompleteAsync,
  clearTopicDetails
} from '../../../redux/slices/home/homeSlice';
import BackButton from '../../../components/common/BackButton';
import CustomButton from '../../../components/common/CustomButton';
import HtmlRenderer from '../../../components/common/HtmlRenderer';
import VideoPlayer from '../../../components/home/VideoPlayer';
import { JOURNEY } from '../../../constants/strings';
import JourneyTags from '../../../components/home/journey/JourneyTags';
import JourneyNavigationButtons from '../../../components/home/journey/JourneyNavigationButtons';

type TopicDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'TopicDetails'>;
type TopicDetailsRouteProp = RouteProp<AppStackParamList, 'TopicDetails'>;

const TopicDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<TopicDetailsNavigationProp>();
  const route = useRoute<TopicDetailsRouteProp>();
  const { topicId, stepId, stepType } = route.params;
  const dispatch = useAppDispatch();
  const [reflection, setReflection] = useState('');
  const hasLoadedReflection = useRef(false);

  // Get topic details from Redux state
  const { 
    topicDetails, 
    isLoadingTopicDetails, 
    topicDetailsError, 
    phaseTopics,
    isSavingReflection,
    isDownloadingPDF,
    isMarkingComplete,
  } = useAppSelector((state) => state.home);

  // Fetch topic details on mount - always fetch fresh data from API
  useEffect(() => {
    const topicIdNum = parseInt(topicId, 10);
    if (!isNaN(topicIdNum)) {
      // Clear any existing topic details to ensure we use fresh API data
      dispatch(clearTopicDetails());
      // Fetch fresh topic details from API
      dispatch(fetchTopicDetailsAsync(topicIdNum));
      // Reset reflection loading flag when topic changes
      hasLoadedReflection.current = false;
      setReflection('');
    }
  }, [topicId, dispatch]);

  // Load saved reflection from API-fetched topicDetails only (ensure it matches current topicId)
  useEffect(() => {
    const topicIdNum = parseInt(topicId, 10);
    // Only use reflection_answers if topicDetails exists, matches current topicId, and is from API response
    if (
      topicDetails && 
      !isLoadingTopicDetails && 
      topicDetails.sub_topic?.id === topicIdNum &&
      topicDetails?.reflection_answers && 
      !hasLoadedReflection.current
    ) {
      // reflection_answers is now an array of objects with reflection_text
      if (Array.isArray(topicDetails.reflection_answers) && topicDetails.reflection_answers.length > 0) {
        // Get the most recent reflection (last in array) or combine all reflections
        const latestReflection = topicDetails.reflection_answers[topicDetails.reflection_answers.length - 1];
        if (latestReflection?.reflection_text && latestReflection.reflection_text.trim().length > 0) {
          setReflection(latestReflection.reflection_text);
          hasLoadedReflection.current = true;
        }
      }
    }
  }, [topicDetails, topicId, isLoadingTopicDetails]);

  // HTML content for rendering
  const htmlContent = useMemo(() => {
    return {
      description: topicDetails?.sub_topic?.description || '',
      keyPoints: topicDetails?.key_points || '',
    };
  }, [topicDetails]);

  // Get reflection questions - ensure it's always an array
  const reflectionQuestions = useMemo(() => {
    if (!topicDetails || !topicDetails.reflection_questions) {
      return [];
    }
    return Array.isArray(topicDetails.reflection_questions) 
      ? topicDetails.reflection_questions 
      : [];
  }, [topicDetails]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!topicDetails || topicDetails.total_topics === 0) return 0;
    return (topicDetails.completed_topics / topicDetails.total_topics) * 100;
  }, [topicDetails]);

  // Check if topic is already completed
  const isTopicCompleted = useMemo(() => {
    return topicDetails?.sub_topic?.status === 'COMPLETED' || topicDetails?.sub_topic?.status === 'Completed';
  }, [topicDetails]);

  const handleSaveReflection = async () => {
    if (!reflection.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your reflection before saving.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    const topicIdNum = parseInt(topicId, 10);
    if (isNaN(topicIdNum)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid topic ID',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await dispatch(saveReflectionAsync({ topicId: topicIdNum, reflection: reflection.trim() })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Reflection saved successfully!',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to save reflection';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  const handleDownloadPDF = async () => {
    const topicIdNum = parseInt(topicId, 10);
    if (isNaN(topicIdNum)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid topic ID',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      const response = await dispatch(downloadPDFAsync(topicIdNum)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'PDF download initiated. Please check your downloads folder.',
        position: 'bottom',
        visibilityTime: 4000,
      });
      // Note: You may need to implement actual file download handling here
      // depending on how your API returns the PDF (blob, base64, URL, etc.)
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to download PDF';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  const handleMarkTopicComplete = async () => {
    const topicIdNum = parseInt(topicId, 10);
    const phaseIdNum = parseInt(stepId, 10);
    
    if (isNaN(topicIdNum) || isNaN(phaseIdNum)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid topic or phase ID',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await dispatch(markTopicCompleteAsync({ topicId: topicIdNum, phaseId: phaseIdNum })).unwrap();
      
      // After marking complete, navigate to completion screen
      const nextTopicId = topicDetails?.next_topic_id?.toString() || null;
      navigation.replace('TopicCompletion', {
        topicId: topicId,
        stepId: stepId,
        stepType: stepType,
        nextTopicId: nextTopicId,
      });
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark topic as complete';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  const handleBackToOverview = () => {
    navigation.goBack()
  };

  // Show loading state
  if (isLoadingTopicDetails) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, commonStyles.center]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  // Show error state
  if (topicDetailsError || !topicDetails) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, commonStyles.center]}>
        <Text style={styles.errorText}>{topicDetailsError || JOURNEY.TOPIC_NOT_FOUND}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={commonStyles.headerSection}>
        <View style={[commonStyles.row, styles.headerTopRow]}>
          <BackButton
            color={COLORS.PRIMARY}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Dashboard');
              }
            }}
            bottomMargin={0}
          />

          <JourneyTags
            stepType={stepType}
            version={undefined}
            showVersionToggle={phaseTopics?.isVersionTabAvailable || false}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{topicDetails.sub_topic.title}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >

        {/* Description */}
        {htmlContent.description && (
          <View style={[commonStyles.card, styles.section, { borderColor: COLORS.BORDER_LIGHT }]}>
            <HtmlRenderer
              html={htmlContent.description}
              contentWidth={width - scale(48)}
              textColor={COLORS.TEXT_PRIMARY}
              fontSize={scaleFont(14)}
              lineHeight={scaleFont(22)}
            />
          </View>
        )}

        {/* Video Player Section */}
        {topicDetails.sub_topic.video_url && topicDetails.sub_topic.video_url.length > 0 && (
          <VideoPlayer
            videoUrl={topicDetails.sub_topic.video_url[0]}
            variant="main"
          />
        )}

        {/* Key Learning Points */}
        {htmlContent.keyPoints && htmlContent.keyPoints.trim().length > 0 && (
          <View style={[commonStyles.card, styles.section, { borderColor: COLORS.BORDER_LIGHT }]}>
            <Text style={styles.sectionTitle}>{JOURNEY.KEY_LEARNING_POINTS}</Text>
            <HtmlRenderer
              html={htmlContent.keyPoints}
              contentWidth={width - scale(48)}
              textColor={COLORS.TEXT_PRIMARY}
              fontSize={scaleFont(14)}
              lineHeight={scaleFont(22)}
            />
          </View>
        )}

        <View style={[commonStyles.card, { borderColor: COLORS.BORDER_LIGHT }]}>
          {/* Reflection Questions */}
          {Array.isArray(reflectionQuestions) && reflectionQuestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{JOURNEY.REFLECTION_QUESTIONS}</Text>
              {reflectionQuestions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reflection Input */}
          <View style={styles.section}>
            <TextInput
              style={styles.reflectionInput}
              placeholder={JOURNEY.REFLECTION_PLACEHOLDER}
              placeholderTextColor={COLORS.TEXT_LIGHT}
              multiline
              numberOfLines={6}
              value={reflection}
              onChangeText={setReflection}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              title={JOURNEY.DOWNLOAD_PDF}
              onPress={handleDownloadPDF}
              variant="secondary"
              fullWidth={false}
              style={styles.downloadButton}
              textStyle={styles.downloadButtonText}
              disabled={isDownloadingPDF}
            />
            <CustomButton
              title={JOURNEY.SAVE_REFLECTION}
              onPress={handleSaveReflection}
              variant="primary"
              fullWidth={false}
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
              disabled={isSavingReflection}
            />
          </View>
          {/* Loading Indicators */}
          {(isSavingReflection || isDownloadingPDF) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>
                {isSavingReflection ? 'Saving reflection...' : 'Downloading PDF...'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Buttons */}
      <View style={[{ paddingBottom: insets.bottom }]}>
        <JourneyNavigationButtons
          primaryButtonTitle={JOURNEY.MARK_TOPIC_COMPLETE}
          secondaryButtonTitle={JOURNEY.BACK_TO_OVERVIEW.replace('{stepType}', stepType)}
          onPrimaryPress={handleMarkTopicComplete}
          onSecondaryPress={handleBackToOverview}
          primaryButtonDisabled={isMarkingComplete}
          primaryButtonLoading={isMarkingComplete}
          hidePrimaryButton={isTopicCompleted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  headerTopRow: {
    alignItems: 'center',
    marginBottom: scale(12),
    flexWrap: 'wrap',
  },
  header: {
    ...commonStyles.mb12,
  },
  headerTitle: {
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(2),
    overflow: 'hidden',
    ...commonStyles.mb8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PROGRESS_BAR,
    borderRadius: scale(2),
  },
  descriptionText: {
    ...commonStyles.textSmall,
    lineHeight: scaleFont(20),
    color: COLORS.TEXT_PRIMARY,
  },
  errorText: {
    ...commonStyles.textSmall,
    color: COLORS.ERROR,
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingTop: scale(24),
    paddingBottom: scale(120), // Extra padding for bottom navigation buttons
  },
  section: {
    ...commonStyles.mb24,
  },
  sectionTitle: {
    ...commonStyles.subtitle18Black,
    color: COLORS.PRIMARY,
    ...commonStyles.mb12,
  },
  bulletPoint: {
    ...commonStyles.row,
    ...commonStyles.mb8,
  },
  bullet: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    marginRight: scale(8),
    fontFamily: 'varela_round_regular',
  },
  bulletText: {
    flex: 1,
    ...commonStyles.textSmall,
    lineHeight: scaleFont(20),
  },
  questionContainer: {
    ...commonStyles.row,
    ...commonStyles.mb12,
  },
  questionNumber: {
    ...commonStyles.textSmall,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginRight: scale(8),
  },
  questionText: {
    flex: 1,
    ...commonStyles.textSmall,
    lineHeight: scaleFont(20),
  },
  reflectionInput: {
    ...commonStyles.input,
    borderColor: COLORS.BORDER_LIGHT,
    minHeight: scale(120),
    textAlignVertical: 'top',
  },
  actionButtons: {
    ...commonStyles.row,
    ...commonStyles.gap8,
    ...commonStyles.mb8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY, // Light blue background
    borderWidth: scale(1),
    borderColor: COLORS.WHITE, // White border as shown in image
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  downloadButtonText: {
    fontSize: scaleFont(14),
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  saveButtonText: {
    fontSize: scaleFont(14),
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
    fontWeight: '600',
  },
  loadingContainer: {
    ...commonStyles.row,
    ...commonStyles.center,
    ...commonStyles.mt8,
    gap: scale(8),
  },
  loadingText: {
    ...commonStyles.textSmall,
    color: COLORS.TEXT_MUTED,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    ...commonStyles.row,
    ...commonStyles.center,
    paddingVertical: scale(12),
    gap: scale(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
});

export default TopicDetailsScreen;


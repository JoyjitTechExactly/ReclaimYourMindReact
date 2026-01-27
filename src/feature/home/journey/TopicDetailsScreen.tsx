import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { Topic } from '../../../constants/constantData';
import { useAppSelector } from '../../../redux/hooks';
import BackButton from '../../../components/common/BackButton';
import CustomButton from '../../../components/common/CustomButton';
import VideoPlayer from '../../../components/home/VideoPlayer';
import { JOURNEY } from '../../../constants/strings';
import JourneyTags from '../../../components/home/journey/JourneyTags';
import JourneyNavigationButtons from '../../../components/home/journey/JourneyNavigationButtons';

type TopicDetailsNavigationProp = StackNavigationProp<AppStackParamList, 'TopicDetails'>;
type TopicDetailsRouteProp = RouteProp<AppStackParamList, 'TopicDetails'>;

const TopicDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicDetailsNavigationProp>();
  const route = useRoute<TopicDetailsRouteProp>();
  const { topicId, stepId, stepType } = route.params;
  const [reflection, setReflection] = useState('');

  // Get topics from Redux state
  const { subTopics, phaseTopics } = useAppSelector((state) => state.home);

  const topic = useMemo(() => {
    // Check subtopics (for Action with categoryId)
    if (subTopics?.subtopics) {
      const found = subTopics.subtopics.find(t => t.id.toString() === topicId);
      if (found) {
        return {
          id: found.id.toString(),
          title: found.title,
          description: found.description.replace(/<[^>]*>/g, ''),
          status: found.status || 'NOT_STARTED',
          stepType: stepType,
          videoUrl: found.video_url && found.video_url.length > 0 ? found.video_url[0] : undefined,
          keyLearningPoints: [],
          reflectionQuestions: [],
        } as Topic;
      }
    }
    
    // Check phase topics (for other steps)
    if (phaseTopics?.topics) {
      let topicsToSearch: any[] = [];
      if (Array.isArray(phaseTopics.topics)) {
        topicsToSearch = phaseTopics.topics;
      } else if (phaseTopics.topics.data_1) {
        topicsToSearch = [...phaseTopics.topics.data_1, ...(phaseTopics.topics.data_2 || [])];
      }
      
      const found = topicsToSearch.find(t => t.id.toString() === topicId);
      if (found) {
        return {
          id: found.id.toString(),
          title: found.title,
          description: found.description.replace(/<[^>]*>/g, ''),
          status: found.status || 'NOT_STARTED',
          stepType: stepType,
          videoUrl: found.video_url && found.video_url.length > 0 ? found.video_url[0] : undefined,
          keyLearningPoints: [],
          reflectionQuestions: [],
        } as Topic;
      }
    }
    
    return null;
  }, [topicId, subTopics, phaseTopics, stepType]);

  const handleSaveReflection = () => {
    // Save reflection logic here
    console.log('Reflection saved:', reflection);
  };

  const handleDownloadPDF = () => {
    // Download PDF logic here
    console.log('Download PDF');
  };

  const handleMarkTopicComplete = () => {
    navigation.navigate('TopicCompletion', {
      topicId: topicId,
      stepId: stepId,
      stepType: stepType,
    });
  };

  const handleBackToOverview = () => {
    // // For Action step, check if we need to go back to category or main overview
    // if (stepType === 'Action' && stepData?.categories) {
    //   const topicCategory = stepData.categories.find(cat => 
    //     cat.topics.some(t => t.id === topicId)
    //   );
    //   if (topicCategory) {
    //     navigation.navigate('TopicListing', { 
    //       stepId, 
    //       stepType, 
    //       categoryId: topicCategory.id 
    //     });
    //   } else {
    //     navigation.navigate('TopicListing', { stepId, stepType });
    //   }
    // } else {
    //   navigation.navigate('TopicListing', { stepId, stepType });
    // }
    navigation.goBack()
  };

  if (!topic) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>{JOURNEY.TOPIC_NOT_FOUND}</Text>
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
          <Text style={styles.headerTitle}>{topic.title}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >

        {/* Video Player Section */}
        {topic.videoUrl && (
          <VideoPlayer
            title={topic.title}
            videoUrl={topic.videoUrl}
            variant="main"
            currentTime="0:00"
          />
        )}

        {/* Key Learning Points */}
        {topic.keyLearningPoints && topic.keyLearningPoints.length > 0 && (
          <View style={[commonStyles.card, styles.section, { borderColor: COLORS.BORDER_LIGHT }]}>
            <Text style={styles.sectionTitle}>{JOURNEY.KEY_LEARNING_POINTS}</Text>
            {topic.keyLearningPoints.map((point, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[commonStyles.card, { borderColor: COLORS.BORDER_LIGHT }]}>
          {/* Reflection Questions */}
          {topic.reflectionQuestions && topic.reflectionQuestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{JOURNEY.REFLECTION_QUESTIONS}</Text>
              {topic.reflectionQuestions.map((question, index) => (
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
            />
            <CustomButton
              title={JOURNEY.SAVE_REFLECTION}
              onPress={handleSaveReflection}
              variant="primary"
              fullWidth={false}
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Buttons */}
      <View style={[{ paddingBottom: insets.bottom }]}>
        <JourneyNavigationButtons
          primaryButtonTitle={JOURNEY.MARK_TOPIC_COMPLETE}
          secondaryButtonTitle={JOURNEY.BACK_TO_OVERVIEW.replace('{stepType}', stepType)}
          onPrimaryPress={handleMarkTopicComplete}
          onSecondaryPress={handleBackToOverview}
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
    width: '30%', // Example progress - can be dynamic
    backgroundColor: COLORS.PROGRESS_BAR,
    borderRadius: scale(2),
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
});

export default TopicDetailsScreen;


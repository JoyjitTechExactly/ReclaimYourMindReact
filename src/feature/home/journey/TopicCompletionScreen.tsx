import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { ImagePath } from '../../../constants/imagePath';
import { useAppSelector } from '../../../redux/hooks';
import { JOURNEY } from '../../../constants/strings';
import JourneyNavigationButtons from '../../../components/home/journey/JourneyNavigationButtons';

type TopicCompletionRouteProp = RouteProp<AppStackParamList, 'TopicCompletion'>;
type TopicCompletionNavigationProp = StackNavigationProp<AppStackParamList, 'TopicCompletion'>;

const TopicCompletionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicCompletionNavigationProp>();
  const route = useRoute<TopicCompletionRouteProp>();
  const { topicId, stepId, stepType, nextTopicId } = route.params;

  // Get topics from Redux state
  const { subTopics, phaseTopics, phases, topicDetails } = useAppSelector((state) => state.home);

  const currentPhase = useMemo(() => {
    return phases.find(phase => phase.id.toString() === stepId);
  }, [phases, stepId]);

  const completedCount = useMemo(() => {
    // First priority: use topicDetails from API (most accurate)
    if (topicDetails) {
      return topicDetails.completed_topics || 0;
    }
    // Fallback to other sources
    if (subTopics) {
      return subTopics.completed_topics || 0;
    }
    if (phaseTopics) {
      return phaseTopics.completed_topics || 0;
    }
    return currentPhase?.completed_topics || 0;
  }, [topicDetails, subTopics, phaseTopics, currentPhase]);

  const totalCount = useMemo(() => {
    // First priority: use topicDetails from API (most accurate)
    if (topicDetails) {
      return topicDetails.total_topics || 0;
    }
    // Fallback to other sources
    if (subTopics) {
      return subTopics.total_topics || 0;
    }
    if (phaseTopics) {
      return phaseTopics.total_topics || 0;
    }
    return currentPhase?.total_topics || 0;
  }, [topicDetails, subTopics, phaseTopics, currentPhase]);

  const nextTopic = useMemo(() => {
    // First, try to use next_topic_id from route params (passed from TopicDetailsScreen)
    if (nextTopicId) {
      return {
        id: nextTopicId,
        title: '', // Title not needed for navigation
      };
    }
    
    // Fallback: try to get next_topic_id from topicDetails in Redux
    if (topicDetails?.next_topic_id) {
      return {
        id: topicDetails.next_topic_id.toString(),
        title: '',
      };
    }
    
    // Last resort: Find next topic from current topics list
    let topicsList: any[] = [];
    
    if (subTopics?.subtopics) {
      topicsList = subTopics.subtopics;
    } else if (phaseTopics?.topics) {
      if (Array.isArray(phaseTopics.topics)) {
        topicsList = phaseTopics.topics;
      } else if (phaseTopics.topics.data_1) {
        topicsList = [...phaseTopics.topics.data_1, ...(phaseTopics.topics.data_2 || [])];
      }
    }
    
    const currentIndex = topicsList.findIndex(t => t.id.toString() === topicId);
    if (currentIndex >= 0 && currentIndex < topicsList.length - 1) {
      const next = topicsList[currentIndex + 1];
      return {
        id: next.id.toString(),
        title: next.title,
      };
    }
    return null;
  }, [nextTopicId, topicDetails, subTopics, phaseTopics, topicId]);

  const handleNextTopic = () => {
    if (nextTopic) {
      navigation.replace('TopicDetails', {
        topicId: nextTopic.id,
        stepId: stepId,
        stepType: stepType,
      });
    } else {
      handleBackToOverview();
    }
  };

  const handleBackToOverview = () => {
    // For Action step, check if we need to go back to category or main overview
    // Use parent_id from subTopics if available (more accurate), otherwise try sub_topic_id from topicDetails
    let categoryId: string | undefined;
    if (stepType === 'Action') {
      if (subTopics?.parent_id) {
        categoryId = subTopics.parent_id.toString();
      } else if (topicDetails?.sub_topic_id) {
        categoryId = topicDetails.sub_topic_id.toString();
      }
    }
    
    // Reset navigation stack to go back to the original TopicListing page
    // This prevents multiple TopicListing screens from stacking up
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Dashboard' },
        {
          name: 'TopicListing',
          params: {
            stepId,
            stepType,
            ...(categoryId && { categoryId }),
          },
        },
      ],
    });
  };

  const getPrimaryButtonTitle = () => {
    return nextTopic ? JOURNEY.NEXT_TOPIC : JOURNEY.BACK_TO_OVERVIEW_BUTTON;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Image
            source={ImagePath.CircleCheck}
            style={styles.checkmarkImage}
            resizeMode="contain"
          />
        </View>

        {/* Completion Message */}
        <Text style={styles.completionMessage}>
          {JOURNEY.COMPLETION_MESSAGE}
        </Text>

        {/* Instructional Text */}
        <Text style={styles.instructionText}>
          {JOURNEY.COMPLETION_INSTRUCTION}
        </Text>

        {/* Progress Card */}
        {totalCount > 0 && (
          <View style={styles.progressCard}>
            <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.mb8]}>
              <Text style={styles.progressLabel}>
                {subTopics?.phase_name || phaseTopics?.phase_name || currentPhase?.name || stepType}
              </Text>
              <Text style={styles.progressText}>
                {JOURNEY.COMPLETED_COUNT.replace('{completed}', completedCount.toString()).replace('{total}', totalCount.toString())}
              </Text>
            </View>
            <View style={commonStyles.progressBar}>
              <View
                style={[
                  commonStyles.progressBarFill,
                  { width: `${(completedCount / totalCount) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Fixed Bottom Navigation Buttons */}
      <View style={[{ paddingBottom: insets.bottom }]}>
        <JourneyNavigationButtons
          primaryButtonTitle={getPrimaryButtonTitle()}
          secondaryButtonTitle={JOURNEY.BACK_TO_OVERVIEW.replace('{stepType}', stepType)}
          onPrimaryPress={handleNextTopic}
          onSecondaryPress={handleBackToOverview}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    flex: 1,
    ...commonStyles.p16,
    ...commonStyles.center,
  },
  successIconContainer: {
    ...commonStyles.mb24,
    ...commonStyles.center,
  },
  checkmarkImage: {
    marginTop: scale(40),
    width: scale(120),
    height: scale(120),
    resizeMode: 'contain'
  },
  completionMessage: {
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    ...commonStyles.mb16,
  },
  instructionText: {
    ...commonStyles.description,
    color: COLORS.TEXT_MUTED,
    ...commonStyles.mb32,
  },
  progressCard: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    ...commonStyles.p16,
    ...commonStyles.cardShadow,
  },
  progressLabel: {
    ...commonStyles.textTiny,
    color: COLORS.TEXT_DARK,
  },
  progressText: {
    ...commonStyles.textTiny,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default TopicCompletionScreen;


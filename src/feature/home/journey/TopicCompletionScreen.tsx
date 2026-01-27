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
  const { topicId, stepId, stepType } = route.params;

  // Get topics from Redux state
  const { subTopics, phaseTopics, phases } = useAppSelector((state) => state.home);

  const currentPhase = useMemo(() => {
    return phases.find(phase => phase.id.toString() === stepId);
  }, [phases, stepId]);

  const completedCount = useMemo(() => {
    if (subTopics) {
      return subTopics.completed_topics || 0;
    }
    if (phaseTopics) {
      return phaseTopics.completed_topics || 0;
    }
    return currentPhase?.completed_topics || 0;
  }, [subTopics, phaseTopics, currentPhase]);

  const totalCount = useMemo(() => {
    if (subTopics) {
      return subTopics.total_topics || 0;
    }
    if (phaseTopics) {
      return phaseTopics.total_topics || 0;
    }
    return currentPhase?.total_topics || 0;
  }, [subTopics, phaseTopics, currentPhase]);

  const nextTopic = useMemo(() => {
    // Find next topic from current topics list
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
  }, [subTopics, phaseTopics, topicId]);

  const handleNextTopic = () => {
    if (nextTopic) {
      navigation.navigate('TopicDetails', {
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
    navigation.goBack();
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


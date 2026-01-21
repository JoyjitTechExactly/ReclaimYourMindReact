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
import { mockTopics } from '../../../constants/constantData';
import { JOURNEY } from '../../../constants/strings';
import JourneyNavigationButtons from '../../../components/common/home/journey/JourneyNavigationButtons';

type TopicCompletionRouteProp = RouteProp<AppStackParamList, 'TopicCompletion'>;
type TopicCompletionNavigationProp = StackNavigationProp<AppStackParamList, 'TopicCompletion'>;

const TopicCompletionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicCompletionNavigationProp>();
  const route = useRoute<TopicCompletionRouteProp>();
  const { topicId, stepId, stepType } = route.params;

  const stepData = useMemo(() => {
    return mockTopics.find(st => st.stepId === stepId);
  }, [stepId]);

  const completedCount = useMemo(() => {
    if (!stepData) return 0;

    // For Action step with categories
    if (stepData.categories && stepData.stepType === 'Action') {
      let totalCompleted = 0;
      let totalTopics = 0;
      stepData.categories.forEach(category => {
        category.topics.forEach(topic => {
          totalTopics++;
          if (topic.status === 'COMPLETED') {
            totalCompleted++;
          }
        });
      });
      return totalCompleted;
    }

    // For Acceptance step, count based on version
    if (stepData.showVersionToggle && stepData.stepType === 'Acceptance') {
      // This would need the selected version, but for now count all
      return stepData.topics.filter(t => t.status === 'COMPLETED').length;
    }

    return stepData.topics.filter(t => t.status === 'COMPLETED').length;
  }, [stepData]);

  const totalCount = useMemo(() => {
    if (!stepData) return 0;

    // For Action step with categories
    if (stepData.categories && stepData.stepType === 'Action') {
      let total = 0;
      stepData.categories.forEach(category => {
        total += category.topics.length;
      });
      return total;
    }

    return stepData.topics.length;
  }, [stepData]);

  const currentTopicIndex = useMemo(() => {
    if (!stepData) return -1;

    // For Action step with categories
    if (stepData.categories && stepData.stepType === 'Action') {
      let index = 0;
      for (const category of stepData.categories) {
        const topicIndex = category.topics.findIndex(t => t.id === topicId);
        if (topicIndex >= 0) {
          return index + topicIndex;
        }
        index += category.topics.length;
      }
      return -1;
    }

    return stepData.topics.findIndex(t => t.id === topicId);
  }, [stepData, topicId]);

  const nextTopic = useMemo(() => {
    if (currentTopicIndex < 0) return null;

    // For Action step with categories
    if (stepData?.categories && stepData.stepType === 'Action') {
      let currentIndex = 0;
      for (const category of stepData.categories) {
        for (let i = 0; i < category.topics.length; i++) {
          if (currentIndex === currentTopicIndex && i < category.topics.length - 1) {
            return category.topics[i + 1];
          }
          if (currentIndex === currentTopicIndex && i === category.topics.length - 1) {
            // Check next category
            const currentCategoryIndex = stepData.categories.indexOf(category);
            if (currentCategoryIndex < stepData.categories.length - 1) {
              const nextCategory = stepData.categories[currentCategoryIndex + 1];
              if (nextCategory.topics.length > 0) {
                return nextCategory.topics[0];
              }
            }
          }
          currentIndex++;
        }
      }
      return null;
    }

    if (currentTopicIndex >= 0 && currentTopicIndex < totalCount - 1) {
      return stepData?.topics[currentTopicIndex + 1];
    }
    return null;
  }, [stepData, currentTopicIndex, totalCount, topicId]);

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
    if (stepType === 'Action' && stepData?.categories) {
      const topicCategory = stepData.categories.find(cat =>
        cat.topics.some(t => t.id === topicId)
      );
      if (topicCategory) {
        navigation.navigate('TopicListing', {
          stepId,
          stepType,
          categoryId: topicCategory.id
        });
      } else {
        navigation.navigate('TopicListing', { stepId, stepType });
      }
    } else {
      navigation.navigate('TopicListing', { stepId, stepType });
    }
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
        {stepData && totalCount > 0 && (
          <View style={styles.progressCard}>
            <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.mb8]}>
              <Text style={styles.progressLabel}>{stepData.title}</Text>
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


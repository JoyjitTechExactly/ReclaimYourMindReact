import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { Topic, ExtraVideo } from '../../../constants/constantData';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { 
  fetchTopicDetailsAsync, 
  markTopicCompleteAsync,
  clearTopicDetails
} from '../../../redux/slices/home/homeSlice';
import BackButton from '../../../components/common/BackButton';
import VideoPlayer from '../../../components/home/VideoPlayer';
import { JOURNEY } from '../../../constants/strings';
import JourneyTags from '../../../components/home/journey/JourneyTags';
import JourneyNavigationButtons from '../../../components/home/journey/JourneyNavigationButtons';

type ExtraVideosNavigationProp = StackNavigationProp<AppStackParamList, 'ExtraVideos'>;
type ExtraVideosRouteProp = RouteProp<AppStackParamList, 'ExtraVideos'>;

const ExtraVideosScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ExtraVideosNavigationProp>();
  const route = useRoute<ExtraVideosRouteProp>();
  const { topicId, stepId, stepType } = route.params;
  const dispatch = useAppDispatch();

  // Get topics and topic details from Redux state
  const { 
    subTopics, 
    phaseTopics,
    topicDetails,
    isLoadingTopicDetails,
    topicDetailsError,
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
    }
  }, [topicId, dispatch]);

  const topic = useMemo(() => {
    // Check subtopics (for Action with categoryId)
    if (subTopics?.subtopics) {
      const found = subTopics.subtopics.find(t => t.id.toString() === topicId);
      if (found) {
        return {
          id: found.id.toString(),
          title: found.title,
          videoUrl: found.video_url && found.video_url.length > 0 ? found.video_url[0] : undefined,
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
          videoUrl: found.video_url && found.video_url.length > 0 ? found.video_url[0] : undefined,
        } as Topic;
      }
    }
    
    return null;
  }, [topicId, subTopics, phaseTopics]);

  // Get extra videos from API response
  const extraVideos: ExtraVideo[] = useMemo(() => {
    const videos: ExtraVideo[] = [];
    
    // Check if there's an "Extra Videos" topic with video_url array
    if (subTopics?.subtopics) {
      const extraVideosTopic = subTopics.subtopics.find(t => t.id.toString() === topicId);
      if (extraVideosTopic && extraVideosTopic.video_url && Array.isArray(extraVideosTopic.video_url)) {
        extraVideosTopic.video_url.forEach((url: string, index: number) => {
          videos.push({
            id: `extra-${extraVideosTopic.id}-${index}`,
            title: `Extra Video ${index + 1}`,
            duration: '',
            videoUrl: url,
          });
        });
      }
    }
    
    // Check phase topics
    if (phaseTopics?.topics) {
      let topicsToSearch: any[] = [];
      if (Array.isArray(phaseTopics.topics)) {
        topicsToSearch = phaseTopics.topics;
      } else if (phaseTopics.topics.data_1) {
        topicsToSearch = [...phaseTopics.topics.data_1, ...(phaseTopics.topics.data_2 || [])];
      }
      
      const extraVideosTopic = topicsToSearch.find(t => t.id.toString() === topicId);
      if (extraVideosTopic && extraVideosTopic.video_url && Array.isArray(extraVideosTopic.video_url)) {
        extraVideosTopic.video_url.forEach((url: string, index: number) => {
          videos.push({
            id: `extra-${extraVideosTopic.id}-${index}`,
            title: `Extra Video ${index + 1}`,
            duration: '',
            videoUrl: url,
          });
        });
      }
    }
    
    // Also check phaseTopics.extra_videos if available
    if (phaseTopics?.extra_videos && Array.isArray(phaseTopics.extra_videos)) {
      phaseTopics.extra_videos.forEach((url: string, index: number) => {
        videos.push({
          id: `phase-extra-${index}`,
          title: `Extra Video ${index + 1}`,
          duration: '',
          videoUrl: url,
        });
      });
    }
    
    return videos;
  }, [topicId, subTopics, phaseTopics]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!topicDetails || topicDetails.total_topics === 0) return 0;
    return (topicDetails.completed_topics / topicDetails.total_topics) * 100;
  }, [topicDetails]);

  // Check if topic is already completed
  const isTopicCompleted = useMemo(() => {
    return topicDetails?.sub_topic?.status === 'COMPLETED' || topicDetails?.sub_topic?.status === 'Completed';
  }, [topicDetails]);

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
    navigation.goBack();
  };


  const renderVideoItem = ({ item }: { item: ExtraVideo }) => {
    return (
      <VideoPlayer
        videoUrl={item.videoUrl}
        variant="card"
      />
    );
  };

  // Show loading state
  if (isLoadingTopicDetails) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, commonStyles.center]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>{JOURNEY.TOPIC_NOT_FOUND}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

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
          <Text style={styles.headerTitle}>{JOURNEY.EXTRA_VIDEOS_TITLE}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={commonStyles.contentTransparent}>
          {extraVideos.length > 0 ? (
            <FlatList
              data={extraVideos}
              keyExtractor={(item) => item.id}
              renderItem={renderVideoItem}
              scrollEnabled={false}
              contentContainerStyle={styles.videosList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{JOURNEY.NO_EXTRA_VIDEOS}</Text>
            </View>
          )}

        </View>
      </ScrollView>
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
  videosList: {
    paddingBottom: scale(16),
  },
  emptyState: {
    padding: scale(40),
    ...commonStyles.center,
  },
  emptyStateText: {
    ...commonStyles.textSmall,
    color: COLORS.TEXT_MUTED,
  },
  navigationButtons: {
    ...commonStyles.gap8,
    ...commonStyles.mt24,
    ...commonStyles.mb40,
  },
});

export default ExtraVideosScreen;


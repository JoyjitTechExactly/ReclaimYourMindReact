import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { ImagePath } from '../../../constants/imagePath';
import { Topic } from '../../../constants/constantData';
import { SubTopic } from '../../../network/services/homeService';
import BackButton from '../../../components/common/BackButton';
import TabToggle from '../../../components/common/TabToggle';
import { renderJourneyStatusIcon, getJourneyStatusText } from '../../../utils/journeyUtils';
import { JOURNEY } from '../../../constants/strings';
import JourneyTags from '../../../components/home/journey/JourneyTags';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { fetchPhaseSubTopicsAsync, fetchPhaseTopicsAsync } from '../../../redux/slices/home/homeSlice';

type TopicListingNavigationProp = StackNavigationProp<AppStackParamList, 'TopicListing'>;
type TopicListingRouteProp = RouteProp<AppStackParamList, 'TopicListing'>;

const TopicListingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicListingNavigationProp>();
  const route = useRoute<TopicListingRouteProp>();
  const { stepId, stepType, categoryId } = route.params;
  const dispatch = useAppDispatch();
  const [selectedVersion, setSelectedVersion] = useState<string>('Controller');

  // Get phases, subtopics, and phase topics from Redux
  const { phases, subTopics, phaseTopics, isLoadingSubTopics, subTopicsError } = useAppSelector((state) => state.home);

  // Find the current phase based on stepId
  const currentPhase = useMemo(() => {
    return phases.find(phase => phase.id.toString() === stepId);
  }, [phases, stepId]);

  // Get isVersionTabAvailable from phase data or API response
  const isVersionTabAvailable = phaseTopics?.isVersionTabAvailable ?? currentPhase?.isVersionTabAvailable ?? false;

  // Get user ID from auth state
  const { user } = useAppSelector((state) => state.auth);

  // Fetch data based on whether categoryId is present
  // If categoryId exists (from ActionIntro) → use user/phase/{phaseId}/{categoryId}
  // If categoryId doesn't exist → use user/phase/{phaseId}
  useEffect(() => {
    if (!stepId) return;

    const phaseId = parseInt(stepId, 10);
    if (isNaN(phaseId)) {
      console.warn('Invalid phaseId:', stepId);
      return;
    }

    if (categoryId) {
      // Coming from ActionIntro - fetch subtopics for category
      const catId = parseInt(categoryId, 10);
      if (!isNaN(catId)) {
        console.log('Fetching subtopics (with category):', { phaseId, categoryId: catId });
        dispatch(fetchPhaseSubTopicsAsync({ phaseId, categoryId: catId }));
      }
    } else {
      // Coming from other screens - fetch topics for phase only
      console.log('Fetching phase topics (no category):', { phaseId });
      dispatch(fetchPhaseTopicsAsync(phaseId));
    }
  }, [categoryId, stepId, dispatch]);

  // Map API subtopics to Topic format (when categoryId is present)
  const apiSubTopics: Topic[] = useMemo(() => {
    if (!subTopics || !subTopics.subtopics) return [];
    
    return subTopics.subtopics.map((subtopic) => {
      // Map status from API (null means NOT_STARTED)
      let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED' = 'NOT_STARTED';
      if (subtopic.status === 'COMPLETED') status = 'COMPLETED';
      else if (subtopic.status === 'IN_PROGRESS') status = 'IN_PROGRESS';
      else if (subtopic.status === 'LOCKED') status = 'LOCKED';

      return {
        id: subtopic.id.toString(),
        title: subtopic.title,
        description: subtopic.description.replace(/<[^>]*>/g, ''), // Remove HTML tags
        status: status,
        stepType: stepType as 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action',
        videoUrl: subtopic.video_url && subtopic.video_url.length > 0 ? subtopic.video_url[0] : undefined,
        keyLearningPoints: [],
        reflectionQuestions: [],
      };
    });
  }, [subTopics, stepType]);

  // Map API phase topics to Topic format (when categoryId is not present)
  const apiPhaseTopics: Topic[] = useMemo(() => {
    if (!phaseTopics || !phaseTopics.topics) return [];
    
    // Get topics based on selected version for Acceptance step
    let topicsToMap: SubTopic[] = [];
    
    // Check if topics is an object (for Acceptance) or array (for Action)
    if (!Array.isArray(phaseTopics.topics)) {
      // It's an object with data_1 and data_2
      if (stepType === 'Acceptance' && phaseTopics.isVersionTabAvailable) {
        // Filter by selected version
        if (selectedVersion === 'Controller') {
          const data1 = phaseTopics.topics.data_1;
          // Check if data_1 contains SubTopics (has video_url property) or ActionCategories
          topicsToMap = Array.isArray(data1) && data1.length > 0 && 'video_url' in data1[0] 
            ? (data1 as SubTopic[]) 
            : [];
        } else if (selectedVersion === 'Adapter') {
          const data2 = phaseTopics.topics.data_2;
          topicsToMap = Array.isArray(data2) && data2.length > 0 && 'video_url' in data2[0]
            ? (data2 as SubTopic[])
            : [];
        }
      } else {
        // For other steps or when version tab is not available, use data_1
        const data1 = phaseTopics.topics.data_1;
        // Check if data_1 contains SubTopics (has video_url property) or ActionCategories
        topicsToMap = Array.isArray(data1) && data1.length > 0 && 'video_url' in data1[0]
          ? (data1 as SubTopic[])
          : [];
      }
    }
    // If it's an array, it's Action categories (shouldn't reach here in TopicListing without categoryId)
    
    return topicsToMap.map((topic) => {
      // Map status from API (null means NOT_STARTED)
      let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED' = 'NOT_STARTED';
      if (topic.status === 'COMPLETED' || topic.status === 'Completed') status = 'COMPLETED';
      else if (topic.status === 'IN_PROGRESS' || topic.status === 'In Progress') status = 'IN_PROGRESS';
      else if (topic.status === 'LOCKED') status = 'LOCKED';

      return {
        id: topic.id.toString(),
        title: topic.title,
        description: topic.description.replace(/<[^>]*>/g, ''), // Remove HTML tags
        status: status,
        stepType: stepType as 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action',
        videoUrl: topic.video_url && topic.video_url.length > 0 ? topic.video_url[0] : undefined,
        keyLearningPoints: [],
        reflectionQuestions: [],
      };
    });
  }, [phaseTopics, stepType, selectedVersion]);

  // Get all topics
  const filteredTopics = useMemo(() => {
    // If categoryId is present (from ActionIntro), use subtopics
    if (categoryId) {
      return apiSubTopics;
    }
    // If no categoryId, use phase topics (already filtered by version in apiPhaseTopics)
    return apiPhaseTopics;
  }, [apiSubTopics, apiPhaseTopics, categoryId]);

  // Use API data for progress if available, otherwise use filtered topics
  const completedCount = useMemo(() => {
    if (categoryId && subTopics) {
      return subTopics.completed_topics;
    }
    if (!categoryId && phaseTopics) {
      return phaseTopics.completed_topics;
    }
    return filteredTopics.filter(t => t.status === 'COMPLETED').length;
  }, [filteredTopics, subTopics, phaseTopics, categoryId]);

  const totalCount = useMemo(() => {
    if (categoryId && subTopics) {
      return subTopics.total_topics;
    }
    if (!categoryId && phaseTopics) {
      return phaseTopics.total_topics;
    }
    return filteredTopics.length;
  }, [filteredTopics, subTopics, phaseTopics, categoryId]);

  const handleTopicPress = (topic: Topic) => {
    if (topic.status === 'LOCKED') return;

    // Check if this is "Extra Videos" topic - navigate to ExtraVideosScreen
    if (topic.title.toLowerCase().includes('extra video')) {
      navigation.navigate('ExtraVideos', {
        topicId: topic.id,
        stepId: stepId,
        stepType: stepType,
      });
      return;
    }

    navigation.navigate('TopicDetails', {
      topicId: topic.id,
      stepId: stepId,
      stepType: stepType,
    });
  };


  const renderTopicItem = ({ item }: { item: Topic }) => {
    const isLocked = item.status === 'LOCKED';
    const hasDescription = item.description && item.description.trim().length > 0;

    return (
      <TouchableOpacity
        style={[styles.topicCard, isLocked && styles.lockedCard]}
        onPress={() => handleTopicPress(item)}
        disabled={isLocked}
      >
        <View style={styles.topicContent}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { alignItems: 'flex-start', marginBottom: scale(8) }]}>
            <Text style={styles.topicTitle}>{item.title}</Text>
            <Image source={ImagePath.RightArrow} style={styles.topicArrow} resizeMode="contain" />
          </View>
          {hasDescription && (
            <Text style={styles.topicDescription}>{item.description}</Text>
          )}
          <View style={[commonStyles.row, { justifyContent: 'flex-start', alignItems: 'center' }]}>
            {renderJourneyStatusIcon({ status: item.status, style: commonStyles.statusIcon })}
            <Text style={commonStyles.textSmall}>{getJourneyStatusText(item.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


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
            version={selectedVersion}
            showVersionToggle={isVersionTabAvailable}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {subTopics?.parent_name || phaseTopics?.phase_name || currentPhase?.name || ''}
          </Text>
          <Text style={commonStyles.headerSubtitle}>
            {subTopics?.phase_name || phaseTopics?.phase_description || currentPhase?.description || ''}
          </Text>
        </View>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <View style={[styles.progressSection, commonStyles.mb24]}>
            <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.mb8]}>
              <Text style={commonStyles.textTiny}>{JOURNEY.PROGRESS}</Text>
              <Text style={[commonStyles.textTiny, { color: COLORS.PRIMARY }]}>
                {JOURNEY.TOPICS_COMPLETED.replace('{completed}', completedCount.toString()).replace('{total}', totalCount.toString())}
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

      {/* Content Section */}
      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Controller/Adapter Toggle (Acceptance only) */}
        {stepType === 'Acceptance' && (
          <TabToggle
            options={[
              { label: JOURNEY.CONTROLLER_VERSION, value: 'Controller' },
              { label: JOURNEY.ADAPTER_VERSION, value: 'Adapter' },
            ]}
            selectedValue={selectedVersion}
            onValueChange={setSelectedVersion}
            containerStyle={{ marginBottom: scale(16) }}
            disabled={!isVersionTabAvailable}
          />
        )}

        {/* Topics List */}
        {isLoadingSubTopics ? (
          <View style={styles.emptyContainer}>
            <Text style={commonStyles.textSmall}>Loading...</Text>
          </View>
        ) : subTopicsError ? (
          <View style={styles.emptyContainer}>
            <Text style={[commonStyles.textSmall, { color: COLORS.TEXT_MUTED }]}>
              Error: {subTopicsError}
            </Text>
          </View>
        ) : filteredTopics.length > 0 ? (
          <FlatList
            data={filteredTopics}
            keyExtractor={(item) => item.id}
            renderItem={renderTopicItem}
            scrollEnabled={false}
            contentContainerStyle={styles.topicsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={commonStyles.textSmall}>No topics available</Text>
          </View>
        )}


        {/* Footer Note for Appreciation */}
        {stepType === 'Appreciation' && (
          <View style={[commonStyles.row, commonStyles.center, styles.footerNote]}>
            <Image source={ImagePath.IdeaIcon} style={styles.footerIcon} resizeMode="contain" />
            <Text style={commonStyles.headerSubtitle}>
              {JOURNEY.APPRECIATION_FOOTER}
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginBottom: scale(4),
  },
  contentSection: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingTop: scale(24),
    paddingBottom: scale(40),
  },
  progressSection: {
    ...commonStyles.mt24,
  },
  progressLabel: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_LIGHT,
    fontFamily: 'varela_round_regular',
    ...commonStyles.mb8,
  },
  topicsList: {
    paddingBottom: scale(16),
  },
  topicCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(8),
    ...commonStyles.p16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    marginBottom: scale(12),
    ...commonStyles.cardShadow,
  },
  lockedCard: {
    opacity: 0.6,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    flex: 1,
  },
  topicArrow: {
    width: scale(11),
    height: scale(11),
    marginLeft: scale(8),
  },
  topicDescription: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    ...commonStyles.mb12,
    lineHeight: scaleFont(20),
  },
  extraVideosCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(8),
    ...commonStyles.p16,
    ...commonStyles.mb12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    ...commonStyles.cardShadow,
  },
  extraVideosContent: {
    ...commonStyles.flex1,
  },
  extraVideosHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    alignItems: 'flex-start',
    ...commonStyles.mb8,
  },
  extraVideosTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    flex: 1,
  },
  extraVideosArrow: {
    width: scale(11),
    height: scale(11),
    marginLeft: scale(8),
    tintColor: COLORS.PRIMARY,
  },
  extraVideosDescription: {
    ...commonStyles.textSmall,
    color: COLORS.TEXT_MUTED,
    lineHeight: scaleFont(20),
  },
  footerNote: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    ...commonStyles.p16,
    marginTop: scale(16),
    ...commonStyles.mb24,
  },
  footerIcon: {
    width: scale(20),
    height: scale(20),
    marginEnd: scale(10),
    marginStart: scale(16),
  },
  emptyContainer: {
    padding: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopicListingScreen;


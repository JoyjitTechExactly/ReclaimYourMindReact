import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { commonStyles } from '../../styles/commonStyles';
import { scale, scaleFont } from '../../utils/scaling';
import { ImagePath } from '../../constants/imagePath';
import { mockTopics, Topic, ExtraVideo } from '../../constants/constantData';
import BackButton from '../../components/common/BackButton';
import CustomButton from '../../components/common/CustomButton';
import VideoPlayer from '../../components/common/home/VideoPlayer';
import JourneyNavigationButtons from '../../components/common/journey/JourneyNavigationButtons';
import JourneyTags from '../../components/common/journey/JourneyTags';
import { JOURNEY } from '../../constants/strings';

type ExtraVideosNavigationProp = StackNavigationProp<AppStackParamList, 'ExtraVideos'>;
type ExtraVideosRouteProp = RouteProp<AppStackParamList, 'ExtraVideos'>;

const ExtraVideosScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ExtraVideosNavigationProp>();
  const route = useRoute<ExtraVideosRouteProp>();
  const { topicId, stepId, stepType } = route.params;

  const stepData = useMemo(() => {
    return mockTopics.find(st => st.stepId === stepId);
  }, [stepId]);

  const topic = useMemo(() => {
    // Check if it's in categories (Action step)
    if (stepData?.categories) {
      for (const category of stepData.categories) {
        const foundTopic = category.topics.find(t => t.id === topicId);
        if (foundTopic) return foundTopic;
      }
    }
    // Otherwise check regular topics
    return stepData?.topics.find(t => t.id === topicId);
  }, [topicId, stepData]);

  const extraVideos = topic?.extraVideos || [];

  const handleVideoPress = (video: ExtraVideo) => {
    // Handle video play logic
    console.log('Play video:', video.title);
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
    navigation.goBack();
  };


  const renderVideoItem = ({ item }: { item: ExtraVideo }) => {
    return (
      <VideoPlayer
        title={item.title}
        duration={item.duration}
        videoUrl={item.videoUrl}
        thumbnailUrl={item.thumbnailUrl}
        variant="card"
        showFullscreenIcon={true}
        onPress={() => handleVideoPress(item)}
      />
    );
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

      <View style={commonStyles.headerSection}>
        <View style={[commonStyles.row, styles.headerTopRow]}>
          <BackButton 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Home');
              }
            }}
            bottomMargin={0}
          />

          <JourneyTags
            stepType={stepType}
            version={topic?.version}
            showVersionToggle={stepData?.showVersionToggle || false}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{JOURNEY.EXTRA_VIDEOS_TITLE}</Text>
        </View>

        {/* Progress Bar */}
        {extraVideos.length > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: '25%' }, // Example progress
                ]}
              />
            </View>
          </View>
        )}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
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
  progressSection: {
    ...commonStyles.mb24,
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(2),
    overflow: 'hidden',
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


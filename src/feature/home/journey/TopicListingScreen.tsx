import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { ImagePath } from '../../../constants/imagePath';
import { mockTopics, StepTopics, Topic, VersionType, ActionCategory } from '../../../constants/constantData';
import BackButton from '../../../components/common/BackButton';
import TabToggle from '../../../components/common/TabToggle';
import { renderJourneyStatusIcon, getJourneyStatusText } from '../../../utils/journeyUtils';
import { JOURNEY } from '../../../constants/strings';
import JourneyTags from '../../../components/home/journey/JourneyTags';

type TopicListingNavigationProp = StackNavigationProp<AppStackParamList, 'TopicListing'>;
type TopicListingRouteProp = RouteProp<AppStackParamList, 'TopicListing'>;

const TopicListingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicListingNavigationProp>();
  const route = useRoute<TopicListingRouteProp>();
  const { stepId, stepType, categoryId } = route.params;
  const [selectedVersion, setSelectedVersion] = useState<string>('Controller');

  const stepData = useMemo(() => {
    return mockTopics.find(st => st.stepId === stepId);
  }, [stepId]);

  // For Action step with categories
  const currentCategory = useMemo(() => {
    if (stepData?.categories && categoryId) {
      return stepData.categories.find(cat => cat.id === categoryId);
    }
    return null;
  }, [stepData, categoryId]);

  const filteredTopics = useMemo(() => {
    if (!stepData) return [];

    // For Action step with categories
    if (stepData.categories && stepData.stepType === 'Action') {
      if (categoryId && currentCategory) {
        return currentCategory.topics || [];
      }
      return []; // Will show categories instead
    }

    // For Acceptance step, filter by version if toggle is enabled
    if (stepData.showVersionToggle && stepData.stepType === 'Acceptance') {
      return stepData.topics.filter(topic => topic.version === selectedVersion);
    }

    return stepData?.topics || [];
  }, [stepData, selectedVersion, categoryId, currentCategory]);

  const completedCount = filteredTopics.filter(t => t.status === 'COMPLETED').length;
  const totalCount = filteredTopics.length;

  const handleTopicPress = (topic: Topic) => {
    if (topic.status === 'LOCKED') return;

    navigation.navigate('TopicDetails', {
      topicId: topic.id,
      stepId: stepId,
      stepType: stepType,
    });
  };

  const handleCategoryPress = (category: ActionCategory) => {
    navigation.navigate('TopicListing', {
      stepId: stepId,
      stepType: stepType,
      categoryId: category.id,
    });
  };

  const renderCategoryItem = ({ item }: { item: ActionCategory }) => {
    const completedInCategory = item.topics.filter(t => t.status === 'COMPLETED').length;
    const totalInCategory = item.topics.length;

    return (
      <TouchableOpacity
        style={styles.topicCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.topicContent}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { alignItems: 'flex-start', marginBottom: scale(8) }]}>
            <Text style={styles.topicTitle}>{item.title}</Text>
            <Image source={ImagePath.RightArrow} style={styles.topicArrow} resizeMode="contain" />
          </View>
          <Text style={styles.topicDescription}>{item.description}</Text>
          {totalInCategory > 0 && (
            <Text style={[commonStyles.textTiny, { color: COLORS.TEXT_LIGHT, marginTop: scale(8) }]}>
              {JOURNEY.CATEGORY_COMPLETED.replace('{completed}', completedInCategory.toString()).replace('{total}', totalInCategory.toString())}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTopicItem = ({ item }: { item: Topic }) => {
    const isLocked = item.status === 'LOCKED';

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
          <Text style={styles.topicDescription}>{item.description}</Text>
          <View style={[commonStyles.row, { justifyContent: 'flex-start', alignItems: 'center' }]}>
            {renderJourneyStatusIcon({ status: item.status, style: commonStyles.statusIcon })}
            <Text style={commonStyles.textSmall}>{getJourneyStatusText(item.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!stepData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>{JOURNEY.STEP_NOT_FOUND}</Text>
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
                navigation.navigate('Home');
              }
            }}
            bottomMargin={0}
          />

          <JourneyTags
            stepType={stepType}
            version={selectedVersion}
            showVersionToggle={stepData.showVersionToggle || false}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {currentCategory ? currentCategory.title : stepData.title}
          </Text>
          <Text style={commonStyles.headerSubtitle}>
            {currentCategory ? currentCategory.description : stepData.description}
          </Text>
        </View>

        {/* Progress Bar */}
        {totalCount > 0 && !(stepData?.categories && stepData.stepType === 'Action' && !categoryId) && (
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
        {stepData.showVersionToggle && (
          <TabToggle
            options={[
              { label: JOURNEY.CONTROLLER_VERSION, value: 'Controller' },
              { label: JOURNEY.ADAPTER_VERSION, value: 'Adapter' },
            ]}
            selectedValue={selectedVersion}
            onValueChange={setSelectedVersion}
            containerStyle={{ marginBottom: scale(16) }}
          />
        )}

        {/* For Action step: Show categories if no categoryId, otherwise show topics */}
        {stepData?.categories && stepData.stepType === 'Action' && !categoryId ? (
          <FlatList
            data={stepData.categories}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoryItem}
            scrollEnabled={false}
            contentContainerStyle={styles.topicsList}
          />
        ) : (
          <FlatList
            data={filteredTopics}
            keyExtractor={(item) => item.id}
            renderItem={renderTopicItem}
            scrollEnabled={false}
            contentContainerStyle={styles.topicsList}
          />
        )}

        {/* Extra Videos Card (if applicable) */}
        {filteredTopics.some(t => t.extraVideos && t.extraVideos.length > 0) && (
          <TouchableOpacity
            style={styles.extraVideosCard}
            onPress={() => {
              // Navigate to the first topic with extra videos
              const topicWithVideos = filteredTopics.find(t => t.extraVideos && t.extraVideos.length > 0);
              if (topicWithVideos) {
                navigation.navigate('ExtraVideos', {
                  topicId: topicWithVideos.id,
                  stepId: stepId,
                  stepType: stepType,
                });
              }
            }}
          >
            <Text style={styles.extraVideosText}>{JOURNEY.EXTRA_VIDEOS}</Text>
            <Image source={ImagePath.RightArrow} style={styles.extraVideosArrow} resizeMode="contain" />
          </TouchableOpacity>
        )}

        {/* Footer Note for Appreciation */}
        {stepData.stepType === 'Appreciation' && (
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
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    alignItems: 'center',
    marginTop: scale(8),
    ...commonStyles.mb24,
    ...commonStyles.cardShadow,
  },
  extraVideosText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  extraVideosArrow: {
    width: scale(11),
    height: scale(11),
    tintColor: COLORS.TEXT_LIGHT,
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
});

export default TopicListingScreen;


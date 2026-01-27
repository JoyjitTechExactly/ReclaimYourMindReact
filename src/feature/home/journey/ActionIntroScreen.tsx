import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppStackParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';
import { JOURNEY } from '../../../constants/strings';
import { commonStyles } from '../../../styles/commonStyles';
import { scale, scaleFont } from '../../../utils/scaling';
import { renderJourneyStatusIcon, getJourneyStatusText } from '../../../utils/journeyUtils';
import BackButton from '../../../components/common/BackButton';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { fetchPhaseTopicsAsync } from '../../../redux/slices/home/homeSlice';
import { ActionCategory } from '../../../network/services/homeService';

type ActionIntroNavigationProp = StackNavigationProp<AppStackParamList, 'ActionIntro'>;

const ActionIntroScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ActionIntroNavigationProp>();
  const dispatch = useAppDispatch();
  
  // Get phases from Redux to find Action phase ID dynamically
  const { phases, phaseTopics, isLoadingSubTopics } = useAppSelector((state) => state.home);

  // Find Action phase ID dynamically
  const actionPhaseId = useMemo(() => {
    const actionPhase = phases.find(phase => phase.name === 'Action');
    return actionPhase?.id || null;
  }, [phases]);

  // Fetch Action phase categories using dynamic phase ID
  useEffect(() => {
    if (actionPhaseId) {
      dispatch(fetchPhaseTopicsAsync(actionPhaseId));
    }
  }, [dispatch, actionPhaseId]);

  // Map API categories to ActionCategory format
  const categories: ActionCategory[] = useMemo(() => {
    if (!phaseTopics || !phaseTopics.topics || !phaseTopics.topics.data_1) return [];
    
    // For Action phase, topics.data_1 contains categories
    const data1 = phaseTopics.topics.data_1;
    
    // Check if data_1 contains categories (Action phase) or topics (Acceptance phase)
    // Categories have isSubTopicAvailable property
    if (Array.isArray(data1) && data1.length > 0 && 'isSubTopicAvailable' in data1[0]) {
      return data1.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        total_topics: 0, // Will be updated when we fetch subtopics for this category
        completed_topics: 0, // Will be updated when we fetch subtopics for this category
        status: item.status,
      })) as ActionCategory[];
    }
    
    return [];
  }, [phaseTopics]);

  const getCategoryStatus = (category: ActionCategory): 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' => {
    // Use status from API if available (handle different formats)
    const status = category.status?.toLowerCase();
    if (status === 'in progress' || status === 'in_progress') {
      return 'IN_PROGRESS';
    }
    if (status === 'completed' || status === 'done') {
      return 'COMPLETED';
    }
    
    // Fallback to topic count logic if status not available
    if (category.total_topics === 0) return 'NOT_STARTED';
    
    const completedCount = category.completed_topics || 0;
    const totalCount = category.total_topics || 0;

    if (completedCount === totalCount && totalCount > 0) return 'COMPLETED';
    if (completedCount > 0) return 'IN_PROGRESS';
    return 'NOT_STARTED';
  };


  const handleCategoryPress = (category: ActionCategory) => {
    // Check if this is "Extra Videos" category - navigate to ExtraVideosScreen
    if (category.title.toLowerCase().includes('extra video')) {
      // Find the "Extra Videos" topic from phaseTopics to get its ID
      if (phaseTopics?.topics?.data_1) {
        const extraVideosItem = phaseTopics.topics.data_1.find(
          (item: any) => item.title.toLowerCase().includes('extra video')
        );
        if (extraVideosItem && actionPhaseId) {
          navigation.navigate('ExtraVideos', {
            topicId: extraVideosItem.id.toString(),
            stepId: actionPhaseId.toString(),
            stepType: 'Action',
          });
          return;
        }
      }
    }

    // For other categories, navigate to TopicListing
    if (actionPhaseId) {
      navigation.navigate('TopicListing', {
        stepId: actionPhaseId.toString(),
        stepType: 'Action',
        categoryId: category.id.toString(),
      });
    }
  };

  const renderCategoryItem = (item: ActionCategory) => {
    const categoryStatus = getCategoryStatus(item);

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryContent}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Image source={ImagePath.RightArrow} style={styles.categoryArrow} resizeMode="contain" />
          </View>
          {item.description && item.description.trim().length > 0 && (
            <Text style={styles.categoryDescription}>
              {item.description.replace(/<[^>]*>/g, '')}
            </Text>
          )}
          <View style={commonStyles.row}>
            <View style={styles.statusContainer}>
              {renderJourneyStatusIcon({ status: categoryStatus, style: commonStyles.statusIcon })}
              <Text style={styles.statusText}>{getJourneyStatusText(categoryStatus)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={commonStyles.headerSection}>
        <BackButton
          color={COLORS.PRIMARY}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Dashboard');
            }
          }} />

        <View>
          <Text style={[commonStyles.headerTitle, { color: COLORS.PRIMARY }]}>{JOURNEY.ACTION_TITLE}</Text>
          <Text style={commonStyles.headerSubtitle}>
            {JOURNEY.ACTION_SUBTITLE}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingSubTopics ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading categories...</Text>
          </View>
        ) : categories.length > 0 ? (
          categories.map((item) => (
            <View key={item.id}>
              {renderCategoryItem(item)}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No categories available</Text>
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
  contentSection: {
    ...commonStyles.scrollView,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingTop: scale(24),
    paddingBottom: scale(40),
  },
  categoryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(8),
    ...commonStyles.p16,
    ...commonStyles.mb12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    ...commonStyles.cardShadow,
  },
  categoryContent: {
    ...commonStyles.flex1,
  },
  categoryHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    alignItems: 'flex-start',
    ...commonStyles.mb8,
  },
  categoryTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    flex: 1,
  },
  categoryArrow: {
    width: scale(11),
    height: scale(11),
    marginLeft: scale(8),
    tintColor: COLORS.PRIMARY,
  },
  categoryDescription: {
    ...commonStyles.textSmall,
    color: COLORS.TEXT_MUTED,
    ...commonStyles.mb12,
    lineHeight: scaleFont(20),
  },
  statusContainer: {
    ...commonStyles.row,
    ...commonStyles.center,
  },
  statusText: {
    ...commonStyles.textSmall,
    color: COLORS.TEXT_MUTED,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
  },
  emptyStateText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
});

export default ActionIntroScreen;


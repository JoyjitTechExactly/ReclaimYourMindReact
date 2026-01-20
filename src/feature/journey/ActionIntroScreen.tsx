import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { commonStyles } from '../../styles/commonStyles';
import { scale, scaleFont } from '../../utils/scaling';
import { ImagePath } from '../../constants/imagePath';
import { mockTopics, ActionCategory } from '../../constants/constantData';
import BackButton from '../../components/common/BackButton';
import { renderJourneyStatusIcon, getJourneyStatusText } from '../../utils/journeyUtils';
import { JOURNEY } from '../../constants/strings';

type ActionIntroNavigationProp = StackNavigationProp<AppStackParamList, 'ActionIntro'>;

const ActionIntroScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ActionIntroNavigationProp>();

  const stepData = useMemo(() => {
    return mockTopics.find(st => st.stepId === '4' && st.stepType === 'Action');
  }, []);

  const categories = stepData?.categories || [];

  const getCategoryStatus = (category: ActionCategory): 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' => {
    if (category.topics.length === 0) return 'NOT_STARTED';

    const completedCount = category.topics.filter(t => t.status === 'COMPLETED').length;
    const inProgressCount = category.topics.filter(t => t.status === 'IN_PROGRESS').length;

    if (completedCount === category.topics.length) return 'COMPLETED';
    if (completedCount > 0 || inProgressCount > 0) return 'IN_PROGRESS';
    return 'NOT_STARTED';
  };


  const handleCategoryPress = (category: ActionCategory) => {
    navigation.navigate('TopicListing', {
      stepId: '4',
      stepType: 'Action',
      categoryId: category.id,
    });
  };

  const renderCategoryItem = ({ item }: { item: ActionCategory }) => {
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
          <Text style={styles.categoryDescription}>{item.description}</Text>
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
        <BackButton onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Home');
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
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesList}
        />
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
    ...commonStyles.contentTransparent,
    paddingTop: scale(24),
    paddingBottom: scale(40),
  },
  categoriesList: {
    paddingBottom: scale(16),
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
});

export default ActionIntroScreen;


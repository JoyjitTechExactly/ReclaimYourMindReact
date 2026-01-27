import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { HOME } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleFont } from '../../utils/scaling';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import storage from '../../utils/storage';
import { fetchPhasesAsync } from '../../redux/slices/home/homeSlice';

type HomeNavigationProp = StackNavigationProp<AppStackParamList, 'Dashboard'>;

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { phases, isLoading, overallProgress } = useAppSelector((state) => state.home);

  // Initialize with user data from Redux or storage
  const [fullName, setFullName] = useState(user?.name || '');

  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !user.name || !user.email) {
        try {
          const storedUser = await storage.getUser();
          if (storedUser) {
            setFullName(storedUser.name || '');
          }
        } catch (error) {
          console.error('Error loading user data from storage:', error);
        }
      } else {
        // Use Redux user data
        setFullName(user.name);
      }
    };
    loadUserData();
    dispatch(fetchPhasesAsync());
  }, [user,dispatch]);

  const handleStepPress = (step: JourneyStepItem) => {
    const stepType = step.title as 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action';
    
    // Action step navigation based on isSubPhaseAvailable flag
    if (stepType === 'Action') {
      navigation.navigate('ActionIntro');
    } else {
      // Other steps go directly to TopicListing
      navigation.navigate('TopicListing', {
        stepId: step.id,
        stepType: stepType,
      });
    }

  //   if (step.isSubPhaseAvailable === true) {
  //     // If sub-phases are available, go to ActionIntro (category selection)
  //     navigation.navigate('ActionIntro');
  //     return;
  //   } else {
  //     // If no sub-phases, go directly to TopicListing
  //     // Use replace to ensure we don't go back to ActionIntro if it was previously visited
  //     navigation.replace('TopicListing', {
  //       stepId: step.id,
  //       stepType: stepType,
  //     });
  //     return;
  //   }
  // } else {
  //   // Other steps go directly to TopicListing
  //   navigation.navigate('TopicListing', {
  //     stepId: step.id,
  //     stepType: stepType,
  //   });
  // }
  };

  const renderProgressBar = (progress: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  interface JourneyStepItem {
    id: string;
    title: string;
    description: string;
    progress: number;
    total: number;
    completed: boolean; 
    icon: any;
    imageUrl?: string;
    isSubPhaseAvailable: boolean;
  }

  // Map phases to JourneyStepItem format
  const journeySteps: JourneyStepItem[] = phases.map((phase) => ({
    id: phase.id.toString(),
    title: phase.name,
    description: phase.description,
    progress: phase.completed_topics,
    total: phase.total_topics,
    completed: phase.completed_topics === phase.total_topics && phase.total_topics > 0,
    icon: null, // Will use imageUrl instead
    imageUrl: phase.image_url,
    isSubPhaseAvailable: phase.isSubPhaseAvailable ?? false,
  }));

  const JourneyStepsList = ({ journeySteps }: { journeySteps: JourneyStepItem[] }) => {
    const renderItem = (item: JourneyStepItem) => {
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.journeyStepRow}
          onPress={() => handleStepPress(item)}
          activeOpacity={0.7}
        >
          {/* Left Icon */}
          <View style={styles.iconWrapper}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.journeyStepIcon} />
            ) : (
              item.icon && <Image source={item.icon} style={styles.journeyStepIcon} />
            )}
          </View>

          {/* Right Card */}
          <View style={styles.journeyStepCard}>
            <Text style={styles.journeyStepTitle}>{item.title}</Text>
            <Text style={styles.journeyStepDescription}>{item.description}</Text>

            {item.total > 0 && (
              <View style={styles.progressBarWrapper}>
                <View
                  style={[
                    commonStyles.progressBarFill,
                    {
                      width: `${(item.progress / item.total) * 100}%`,
                    },
                  ]}
                />
              </View>
            )}

            {item.total > 0 && (<View style={[commonStyles.spaceBetween, { flexDirection: 'row' }]}>
              {/* Resume Button */}
              <TouchableOpacity
                style={styles.resumeButton}
                onPress={() => handleStepPress(item)}
              >
                <Text style={styles.resumeButtonText}>{HOME.RESUME}</Text>
              </TouchableOpacity>

              {/* Progress Text */}
              <Text style={[commonStyles.textTiny, { color: COLORS.TEXT_LIGHT }]}>
                {item.progress}/{item.total} {HOME.ITEMS}
              </Text>
            </View>)}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={[styles.journeyStepsList, { marginTop: scale(24) }]}>
        {journeySteps.map(renderItem)}
      </View>
    );
  };

  const headerContent = (
    <>
      <Text style={[commonStyles.headerWeclomeNote, { color: COLORS.SECONDARY }]}>{HOME.WELCOME_BACK}</Text>
      <Text style={[commonStyles.headerTitle, { color: COLORS.PRIMARY }]}>{fullName} 👋</Text>
      <Text style={[commonStyles.headerSubtitle, { color: COLORS.TEXT_MUTED }]}>{HOME.HEADER_SUBTITLE}</Text>
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed Header Section */}
      <View style={commonStyles.fixedHeader}>
        {headerContent}
      </View>

      {/* Scrollable Content */}
      <ImageBackground
        source={ImagePath.ScreenBackground}
        style={commonStyles.backgroundImage}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.contentTransparent}>
            {/* Journey Overview Card */}
            <View>
              <Text style={styles.journeyOverviewTitle}>{HOME.JOURNEY_OVERVIEW_TITLE}</Text>
              <Text style={styles.journeyOverviewSubtitle}>{HOME.JOURNEY_OVERVIEW_SUBTITLE}</Text>

              <TouchableOpacity style={styles.continueButton}>
                <View style={styles.continueButtonContent}>
                  <Image source={ImagePath.ContinueWhereILeftOff} style={{ width: scale(24), height: scale(24), objectFit: 'contain' }} />
                  <Text style={styles.continueButtonText}>{HOME.CONTINUE_WHERE_LEFT_OFF}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Journey Steps List */}
            {!isLoading && <JourneyStepsList journeySteps={journeySteps} />}

            {/* Overall Progress Section */}
            <View style={[styles.section, styles.overallProgress]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>{HOME.OVERALL_PROGRESS}</Text>
                <Text style={styles.progressPercent}>{Math.round(overallProgress * 100)}%</Text>
              </View>

              {renderProgressBar(overallProgress)}

              <Text style={styles.progressSubtitle}>{HOME.PROGRESS_SUBTITLE}</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  headerSection: {
    marginBottom: scale(32),
  },
  section: {
    marginTop: scale(24),
    marginBottom: scale(24),
    ...commonStyles.cardShadow,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: scale(16),
  },
  journeyOverviewCard: {
    backgroundColor: COLORS.CARD_LIGHT,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  journeyOverviewTitle: {
    marginTop: scale(12),
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  journeyOverviewSubtitle: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
    lineHeight: scaleFont(20),
  },
  continueButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    justifyContent: 'center',
    paddingVertical: scale(16),
    marginTop: scale(16),
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonContent: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
  },
  continueButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginStart: scale(12),
    color: COLORS.PRIMARY,
    alignSelf: 'center',
    fontFamily: 'varela_round_regular'
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  sectionSubtitle: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_LIGHT,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_LIGHT,
    borderRadius: 12,
    padding: scale(16),
    marginTop: scale(8),
  },
  continueCardContent: {
    flex: 1,
  },
  continueText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  continueSubtext: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
  },
  journeyList: {
    marginTop: scale(8),
  },
  journeyCard: {
    paddingVertical: scale(16),
  },
  journeyCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  journeyIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: 20,
    backgroundColor: COLORS.ICON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
    marginBottom: scale(12),
  },
  journeyIconText: {
    fontSize: scaleFont(20),
  },
  journeyCardContent: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  journeyDescription: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(12),
    lineHeight: scaleFont(20),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_LIGHT,
    fontFamily: 'varela_round_regular',
  },
  resumeButton: {
    height: scale(32),
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: scale(16),
    paddingVertical: scale(6),
    borderRadius: scale(8),
  },
  resumeButtonText: {
    color: COLORS.WHITE,
    textAlign: 'center',
    fontSize: scaleFont(12),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },
  overallProgress: {
    backgroundColor: COLORS.WHITE,
    marginBottom: scale(120),
    borderRadius: scale(8),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  progressTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  progressPercent: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  progressBarContainer: {
    ...commonStyles.progressBar,
    marginBottom: scale(8),
  },
  progressBar: {
    ...commonStyles.progressBarFill,
  },
  progressSubtitle: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_LIGHT,
    marginBottom: scale(4),
    fontFamily: 'varela_round_regular',
  },
  // Journey Steps Styles
  journeyStepsTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(16),
  },
  journeyStepCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(16),
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  journeyStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  journeyStepIcon: {
    width: scale(42),
    height: scale(42),
    resizeMode: 'contain',
  },
  journeyStepTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  journeyStepDescription: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
  },
  // New FlatList Journey Steps Styles
  iconWrapper: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
    backgroundColor: 'transparent',
  },
  journeyStepRow: {
    width: '100%',
    ...commonStyles.row,
    alignItems: 'center',
    marginBottom: scale(12),
  },
  progressBarWrapper: {
    height: scale(4),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(2),
    marginVertical: scale(12),
  },
  journeyStepsList: {
    paddingBottom: scale(16),
  },
});

export default HomeScreen;

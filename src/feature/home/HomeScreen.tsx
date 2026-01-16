import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { homeJourneyStages } from '../../constants/constantData';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { scale, scaleFont } from '../../utils/scaling';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const overallProgress = 0.41; // 41%

  // Find the next incomplete stage
  const nextStage = homeJourneyStages.find(stage => stage.progress > 0 && stage.progress < stage.total) || homeJourneyStages[0];

  const renderProgressBar = (progress: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  const JourneyStepsList = ({ homeJourneyStages }) => {
    const renderItem = ({ item }) => {
      return (
        <View style={styles.journeyStepRow}>
          {/* Left Icon */}
          <View style={styles.journeyIconWrapper}>
            <Image source={item.icon} style={styles.journeyStepIcon} />
          </View>

          {/* Right Card */}
          <View style={styles.journeyStepCard}>
            <Text style={styles.journeyStepTitle}>{item.title}</Text>
            <Text style={styles.journeyStepDescription}>
              {item.description}
            </Text>

            {item.total > 0 && (
              <View style={styles.progressBarWrapper}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(item.progress / item.total) * 100}%`,
                    },
                  ]}
                />
              </View>
            )}

            <View style={styles.journeyStepFooter}>
              {item.total > 0 && (
                <Text style={styles.journeyStepProgress}>
                  {item.progress}/{item.total} Items
                </Text>
              )}

              <TouchableOpacity style={styles.resumeButton}>
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.journeyStepsContainer}>
        <Text style={styles.journeyStepsTitle}>Journey Steps</Text>

        <FlatList
          data={homeJourneyStages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.journeyStepsList}
        />
      </View>
    );
  };

  const headerContent = (
    <>
      <Text style={[commonStyles.welcomeText, { color: COLORS.SECONDARY }]}>Welcome back,</Text>
      <Text style={[commonStyles.userName, { color: COLORS.PRIMARY }]}>Sarah 👋</Text>
      <Text style={[commonStyles.headerSubtitle, { color: COLORS.TEXT_MUTED }]}>Step by step, you're moving forward.</Text>
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        {headerContent}
      </View>

      {/* Scrollable Content */}
      <ImageBackground 
        source={ImagePath.ScreenBackground} 
        style={styles.backgroundImage}
      >
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.content}>
            {/* Journey Overview Card */}
            <View>
              <Text style={styles.journeyOverviewTitle}>Your Empowerment Journey</Text>
              <Text style={styles.journeyOverviewSubtitle}>Nothing here is rushed. Take your time.</Text>

              <TouchableOpacity style={styles.continueButton}>
                <View style={styles.continueButtonContent}>
                  <Image source={ImagePath.ContinueWhereILeftOff} style={{width: scale(24), height: scale(24), objectFit: 'contain'}}/>
                  <Text style={styles.continueButtonText}>Continue Where I Left Off</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Journey Steps List */}
            <JourneyStepsList homeJourneyStages={homeJourneyStages} />

            {/* Overall Progress Section */}
            <View style={[styles.section, styles.overallProgress]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Overall Progress</Text>
                <Text style={styles.progressPercent}>{Math.round(overallProgress * 100)}%</Text>
              </View>

              {renderProgressBar(overallProgress)}

              <Text style={styles.progressSubtitle}>Step by step, you're moving forward.</Text>
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
  fixedHeader: {
    backgroundColor: COLORS.WHITE,   
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
    paddingBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_HEADER,
  },
  headerSection: {
    marginBottom: scale(32),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(24)
  },
  section: {
    marginTop: scale(24),
    marginBottom: scale(24),
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: scale(16),
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: scale(16),
    paddingVertical: scale(6),
    borderRadius: 16,
  },
  resumeButtonText: {
    color: COLORS.WHITE,
    fontSize: scaleFont(12),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },
  overallProgress: {
    backgroundColor: COLORS.WHITE,
    marginBottom: scale(120),
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
    height: scale(8),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: 4,
    marginBottom: scale(8),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  progressSubtitle: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_LIGHT,
    marginBottom: scale(4),
    fontFamily: 'varela_round_regular',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: COLORS.BACKGROUND,
  },
  // Journey Steps Styles
  journeyStepsContainer: {
    marginTop: scale(24),
  },
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
    marginBottom: scale(16),
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  journeyStepContent: {
    gap: scale(16),
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
    width: scale(24),
    height: scale(24),
    resizeMode: 'contain',
  },
  journeyStepInfo: {
    flex: 1,
  },
  journeyStepTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  journeyStepDescription: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
  },
  journeyStepFooter: {
    marginBottom: scale(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journeyStepProgress: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_LIGHT,
    fontFamily: 'varela_round_regular',
  },
  // New FlatList Journey Steps Styles
  journeyStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  journeyIconWrapper: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  progressBarWrapper: {
    height: scale(4),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: scale(2),
    marginVertical: scale(12),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(2),
  },
  journeyStepsList: {
    paddingBottom: scale(20),
  },
});

export default HomeScreen;

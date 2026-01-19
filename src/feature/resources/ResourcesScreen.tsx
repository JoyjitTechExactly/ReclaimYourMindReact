import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { APP_NAVIGATION, HOME, RESOURCES } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { crisisHotlines, booksArticles, websitesReferrals, CrisisHotline, BookArticle, WebsiteReferral } from '../../constants/constantData';
import CustomButton from '../../components/common/CustomButton';

const ResourcesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const headerContent = (
    <>
      <Text style={[commonStyles.headerTitle, { color: COLORS.PRIMARY}]}>{RESOURCES.TITLE}</Text>
      <Text style={commonStyles.headerSubtitle}>{RESOURCES.SUBTITLE}</Text>   
    </>
  );

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleText = (textNumber: string, keyword?: string) => {
    const message = keyword ? keyword : '';
    Linking.openURL(`sms:${textNumber}${message ? `&body=${message}` : ''}`);
  };

  const handleOpenResource = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleVisitWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const renderCrisisHotlineCard = (hotline: CrisisHotline) => {
    const hasText = !!hotline.textNumber;
    const hasCall = !!hotline.phone;
    const hasBothButtons = hasText && hasCall;
    const hasOnlyOneButton = (hasText && !hasCall) || (!hasText && hasCall);

    return (
      <View key={hotline.id} style={styles.resourceCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>{hotline.name}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>24/7</Text>
          </View>
        </View>
        <View style={styles.hotlineButtons}>
          {hasText && (
            <TouchableOpacity
              style={[
                styles.textButton,
                hasOnlyOneButton && styles.fullWidthButton,
                hasOnlyOneButton && { marginRight: 0 }
              ]}
              onPress={() => handleText(hotline.textNumber!, hotline.textKeyword)}
            >
              <Image source={ImagePath.ChatIcon} style={styles.textButtonIcon} resizeMode="contain" />
              <Text style={styles.textButtonText}>{RESOURCES.TEXT}</Text>
            </TouchableOpacity>
          )}
          {hasCall && (
            <TouchableOpacity
              style={[
                styles.callButton,
                hasOnlyOneButton && styles.fullWidthButton
              ]}
              onPress={() => handleCall(hotline.phone!)}
            >
              <Image source={ImagePath.CallIcon} style={styles.callButtonIcon} resizeMode="contain" />
              <Text style={styles.callButtonText}>{RESOURCES.CALL}</Text>
            </TouchableOpacity>
          )}
        </View>
        {hotline.contactInfo ? (
          <View style={styles.contactInfoContainer}>
            <Text style={styles.hotlineInfo}>{hotline.contactInfo}</Text>
            {hotline.website && (
              <Text style={styles.websiteInfo}>Website: {hotline.website}</Text>
            )}
          </View>
        ) : (
          <View style={styles.contactInfoContainer}>
            {hotline.phone && (
              <Text style={styles.hotlineInfo}>
                {hasText && hasCall ? 'Call ' : ''}{hotline.phone}
              </Text>
            )}
            {hotline.textNumber && (
              <Text style={styles.hotlineInfo}>
                {hasCall ? 'Text ' : 'Text or WhatsApp '}
                {hotline.textKeyword || 'START'} to {hotline.textNumber}
              </Text>
            )}
            {hotline.website && (
              <Text style={styles.websiteInfo}>Website: {hotline.website}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderBookArticleCard = (item: BookArticle) => (
    <View key={item.id} style={styles.resourceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardAuthor}>{RESOURCES.BY} {item.author}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.type}</Text>
        </View>
      </View>
      <CustomButton
        title={RESOURCES.OPEN_RESOURCE}
        onPress={() => handleOpenResource(item.url)}
        variant="primary"
        style={styles.customButton}
        textStyle={{ fontSize: scaleFont(14) }}
      />
    </View>
  );

  const renderWebsiteCard = (item: WebsiteReferral) => (
    <View key={item.id} style={styles.resourceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardWebsite}>{item.website}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.type}</Text>
        </View>
      </View>
      <CustomButton
        title={RESOURCES.VISIT_WEBSITE}
        onPress={() => handleVisitWebsite(item.url)}
        variant="primary"
        style={styles.customButton}
        textStyle={{ fontSize: scaleFont(14) }}
      />
    </View>
  );

  const renderSectionHeader = (iconSource: any, title: string) => (
    <View style={styles.sectionHeader}>
      <Image source={iconSource} style={styles.sectionIcon} resizeMode="contain" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed Header Section */}
      <View style={[commonStyles.fixedHeader, { paddingTop: scale(40)}]}>
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
            {/* Crisis Hotlines Section */}
            {renderSectionHeader(ImagePath.CallIcon, RESOURCES.CRISIS_HOTLINES)}
            {crisisHotlines.map(renderCrisisHotlineCard)}

            {/* Books & Articles Section */}
            {renderSectionHeader(ImagePath.BooksArticlesIcon, RESOURCES.BOOKS_ARTICLES)}
            {booksArticles.map(renderBookArticleCard)}

            {/* Websites & Referrals Section */}
            {renderSectionHeader(ImagePath.WebsitesReferralsIcon, RESOURCES.WEBSITES_REFERRALS)}
            {websitesReferrals.map(renderWebsiteCard)}
            <View style={{ marginBottom: scale(120) }} />
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
  pageHeader: {
    marginBottom: scale(32),
  },
  pageTitle: {
    fontSize: scaleFont(32),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(8),
  },
  pageSubtitle: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(22),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(32),
    marginBottom: scale(16),
  },
  sectionIcon: {
    width: scale(24),
    height: scale(24),
    marginRight: scale(12),
    tintColor: COLORS.PRIMARY,
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  resourceCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    overflow: 'hidden',
    ...commonStyles.cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(16),
    width: '100%',
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: scale(12),
    minWidth: 0,
    flexShrink: 1,
  },
  cardContent: {
    flex: 1,
    marginRight: scale(12),
    minWidth: 0,
  },
  cardTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
    flexShrink: 1,
  },
  cardAuthor: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  cardWebsite: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  tag: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  tagText: {
    fontSize: scaleFont(12),
    fontWeight: '400',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  hotlineButtons: {
    flexDirection: 'row',
    marginBottom: scale(12),
  },
  textButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginRight: scale(12),
  },
  fullWidthButton: {
    flex: 1,
    marginRight: 0,
  },
  textButtonIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(6),
    tintColor: COLORS.PRIMARY,
  },
  textButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  callButtonIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(6),
    tintColor: COLORS.WHITE,
  },
  callButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
  },
  contactInfoContainer: {
    marginTop: scale(4),
  },
  hotlineInfo: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    marginBottom: scale(4),
  },
  websiteInfo: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
  },
  customButton: {
    borderRadius: scale(12),
    paddingVertical: scale(12),
  },
});

export default ResourcesScreen;

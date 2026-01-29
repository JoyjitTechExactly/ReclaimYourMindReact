import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Linking, Platform, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { APP_NAVIGATION, HOME, RESOURCES } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { supportItems, ResourceItem } from '../../constants/constantData';
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
    if (keyword) {
      Linking.openURL(`sms:${textNumber}?body=${encodeURIComponent(keyword)}`);
    } else {
      Linking.openURL(`sms:${textNumber}`);
    }
  };

  const handleOpenWebsite = (website: string) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const handleOpenResource = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleVisitWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const renderHotlineCard = (item: ResourceItem, index: number) => {
    const hasText = !!item.text;
    const hasCall = !!item.phone;
    const hasOnlyOneButton = (hasText && !hasCall) || (!hasText && hasCall);

    return (
      <View key={`hotline-${index}`} style={styles.resourceCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.badge}</Text>
          </View>
        </View>
        {item.description && (
          <Text style={styles.hotlineInfo}>{item.description}</Text>
        )}
        <View style={styles.hotlineButtons}>
          {hasText && (
            <TouchableOpacity
              style={[
                styles.textButton,
                hasOnlyOneButton && styles.fullWidthButton,
                hasOnlyOneButton && { marginRight: 0 }
              ]}
              onPress={() => {
                // Extract keyword from description if available
                let keyword: string | undefined;
                if (item.description) {
                  const match = item.description.match(/Text ['"]([^'"]+)['"]/i);
                  if (match) {
                    keyword = match[1];
                  }
                }
                handleText(item.text!, keyword);
              }}
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
              onPress={() => handleCall(item.phone!)}
            >
              <Image source={ImagePath.CallIcon} style={styles.callButtonIcon} resizeMode="contain" />
              <Text style={styles.callButtonText}>{RESOURCES.CALL}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.contactInfoContainer}>
          {item.website && (
            <TouchableOpacity onPress={() => handleOpenWebsite(item.website!)}>
              <Text style={styles.websiteInfo}>Website: {item.website}</Text>
            </TouchableOpacity>
          )}
          {item.additional_notes && (
            <Text style={styles.additionalNotes}>{item.additional_notes}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderBookCard = (item: ResourceItem, index: number) => (
    <View key={`book-${index}`} style={styles.resourceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.descriptionTop && (
            <Text style={styles.cardAuthor}>{item.descriptionTop}</Text>
          )}
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.badge}</Text>
        </View>
      </View>
      {item.url && (
        <CustomButton
          title={RESOURCES.OPEN_RESOURCE}
          onPress={() => handleOpenResource(item.url)}
          variant="primary"
          style={styles.customButton}
          textStyle={{ fontSize: scaleFont(14) }}
        />
      )}
    </View>
  );

  const renderWebsiteCard = (item: ResourceItem, index: number) => (
    <View key={`website-${index}`} style={styles.resourceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.descriptionTop && (
            <Text style={styles.cardWebsite}>{item.descriptionTop}</Text>
          )}
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.badge}</Text>
        </View>
      </View>
      {item.url && (
        <CustomButton
          title={RESOURCES.VISIT_WEBSITE}
          onPress={() => handleVisitWebsite(item.url!)}
          variant="primary"
          style={styles.customButton}
          textStyle={{ fontSize: scaleFont(14) }}
        />
      )}
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
            {supportItems.filter(item => item.type === 'hotline').length > 0 && (
              <>
                {renderSectionHeader(ImagePath.CallIcon, RESOURCES.CRISIS_HOTLINES)}
                {supportItems
                  .filter(item => item.type === 'hotline')
                  .map((item, index) => renderHotlineCard(item, index))}
              </>
            )}

            {/* Books & Articles Section */}
            {supportItems.filter(item => item.type === 'book').length > 0 && (
              <>
                {renderSectionHeader(ImagePath.BooksArticlesIcon, RESOURCES.BOOKS_ARTICLES)}
                {supportItems
                  .filter(item => item.type === 'book')
                  .map((item, index) => renderBookCard(item, index))}
              </>
            )}

            {/* Websites & Referrals Section */}
            {supportItems.filter(item => item.type === 'website').length > 0 && (
              <>
                {renderSectionHeader(ImagePath.WebsitesReferralsIcon, RESOURCES.WEBSITES_REFERRALS)}
                {supportItems
                  .filter(item => item.type === 'website')
                  .map((item, index) => renderWebsiteCard(item, index))}
              </>
            )}
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
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    textDecorationLine: 'underline',
    marginTop: scale(4),
  },
  additionalNotes: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(16),
    marginTop: scale(8),
    fontStyle: 'italic',
  },
  customButton: {
    borderRadius: scale(12),
    paddingVertical: scale(12),
  },
});

export default ResourcesScreen;

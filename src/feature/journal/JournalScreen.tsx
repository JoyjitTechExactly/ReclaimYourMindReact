import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import { sampleJournalEntries, sampleQAReflections, JournalEntry, QAReflection } from '../../constants/constantData';

type JournalNavigationProp = StackNavigationProp<AppStackParamList, 'Journal'>;

const JournalScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<JournalNavigationProp>();
  const [activeTab, setActiveTab] = useState<'entries' | 'reflections'>('entries');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(sampleJournalEntries);
  const [qaReflections, setQAReflections] = useState<QAReflection[]>(sampleQAReflections);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const handleNewEntry = () => {
    navigation.navigate('NewJournalEntry');
  };

  const handleEditEntry = (entryId: string) => {
    navigation.navigate('JournalEntryDetail', { entryId, editMode: true });
  };

  const handleViewEntry = (entryId: string) => {
    navigation.navigate('JournalEntryDetail', { entryId });
  };

  const handleDeleteEntry = (entryId: string) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
    setMenuVisible(null);
  };

  const handleDownloadEntry = (entryId: string) => {
    // Implement download functionality
    setMenuVisible(null);
  };

  const handleMenuPress = (entryId: string) => {
    setMenuVisible(menuVisible === entryId ? null : entryId);
  };

  const handleViewReflection = (reflectionId: string) => {
    navigation.navigate('QAReflectionDetail', { reflectionId });
  };

  const handleEditReflection = (reflectionId: string) => {
    navigation.navigate('QAReflectionDetail', { reflectionId, editMode: true });
  };

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => {
    const snippet = item.content.length > 150 ? item.content.substring(0, 150) + '...' : item.content;
    const isMenuOpen = menuVisible === item.id;

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => handleViewEntry(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.entryContent}>
        <View style={styles.menuButtonWrapper}>
            <TouchableOpacity
            style={styles.menuButton}
            onPress={(e) => {
              e.stopPropagation();
              handleMenuPress(item.id);
            }}
          >
            <Image source={ImagePath.MoreIcon} style={styles.menuIcon} resizeMode="contain" />
          </TouchableOpacity>
              {isMenuOpen && (
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      handleEditEntry(item.id);
                      setMenuVisible(null);
                    }}
                  >
                    <Image source={ImagePath.EditIcon} style={styles.menuItemIcon} resizeMode="contain" />
                    <Text style={styles.menuItemText}>{JOURNAL.EDIT}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleDownloadEntry(item.id)}
                  >
                    <Image source={ImagePath.DownloadIcon} style={styles.menuItemIcon} resizeMode="contain" />
                    <Text style={styles.menuItemText}>{JOURNAL.DOWNLOAD}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.menuItemDelete]}
                    onPress={() => handleDeleteEntry(item.id)}
                  >
                    <Image source={ImagePath.DeleteIcon} style={[styles.menuItemIcon, styles.menuItemIconDelete]} resizeMode="contain" />
                    <Text style={[styles.menuItemText, styles.menuItemTextDelete]}>{JOURNAL.DELETE}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          <View style={styles.entryHeaderSimple}>
            <Text style={styles.entrySnippetSimple}>{snippet}</Text>
          </View>
          <Text style={styles.entryDate}>{item.date}, {item.time}</Text>
        </View>
        {isMenuOpen && (
          <Modal
            visible={isMenuOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(null)}
          >
            <TouchableOpacity
              style={styles.menuBackdrop}
              activeOpacity={1}
              onPress={() => setMenuVisible(null)}
            />
          </Modal>
        )}
      </TouchableOpacity>
    );
  };

  const renderQAReflection = ({ item }: { item: QAReflection }) => {
    const snippet = item.reflection.length > 150 ? item.reflection.substring(0, 150) + '...' : item.reflection;
    const isMenuOpen = menuVisible === item.id;

    return (
      <>
        <TouchableOpacity
          style={styles.entryCard}
          onPress={() => handleViewReflection(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.entryContent}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{item.focusOfAdvice}</Text>
              <View style={styles.menuButtonWrapper}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleMenuPress(item.id);
                  }}
                >
                  <Image source={ImagePath.MoreIcon} style={styles.menuIcon} resizeMode="contain" />
                </TouchableOpacity>
                {isMenuOpen && (
                  <View style={styles.menuContainer}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        handleEditReflection(item.id);
                        setMenuVisible(null);
                      }}
                    >
                      <Image source={ImagePath.EditIcon} style={styles.menuItemIcon} resizeMode="contain" />
                      <Text style={styles.menuItemText}>{JOURNAL.EDIT}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        handleDownloadEntry(item.id);
                        setMenuVisible(null);
                      }}
                    >
                      <Image source={ImagePath.DownloadIcon} style={styles.menuItemIcon} resizeMode="contain" />
                      <Text style={styles.menuItemText}>{JOURNAL.DOWNLOAD}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.menuItem, styles.menuItemDelete]}
                      onPress={() => {
                        setQAReflections(qaReflections.filter(ref => ref.id !== item.id));
                        setMenuVisible(null);
                      }}
                    >
                      <Image source={ImagePath.DeleteIcon} style={[styles.menuItemIcon, styles.menuItemIconDelete]} resizeMode="contain" />
                      <Text style={[styles.menuItemText, styles.menuItemTextDelete]}>{JOURNAL.DELETE}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            {item.tag && (
              <View style={styles.tagContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              </View>
            )}
            <Text style={styles.entrySnippetQA}>{snippet}</Text>
            <Text style={styles.entryDate}>{item.date}, {item.time}</Text>
          </View>
        </TouchableOpacity>
        {isMenuOpen && (
          <Modal
            visible={isMenuOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(null)}
          >
            <TouchableOpacity
              style={styles.menuBackdrop}
              activeOpacity={1}
              onPress={() => setMenuVisible(null)}
            />
          </Modal>
        )}
      </>
    );
  };

  const renderEmptyState = (type: 'entries' | 'reflections') => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>
          {type === 'entries' ? '📝' : '📄❓'}
        </Text>
      </View>
      <Text style={styles.emptyText}>
        {type === 'entries' ? JOURNAL.NO_ENTRIES_YET : JOURNAL.NO_REFLECTIONS_YET}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed Header Section */}
      <View style={[commonStyles.fixedHeader, { paddingBottom: scale(20) }]}>
        <Text style={[commonStyles.headerTitle, { color: COLORS.PRIMARY, marginBottom: scale(8) }]}>{JOURNAL.TITLE}</Text>
        <Text style={styles.privacyText}>{JOURNAL.PRIVACY_MESSAGE}</Text>
        <View style={styles.privacyContainer}>
          <Image source={ImagePath.LockIcon} style={[styles.menuIcon, { tintColor: COLORS.GRAY, height: scale(14), width: scale(14) }]} resizeMode="contain" />
          <Text style={styles.privacySubtext}>{JOURNAL.PRIVACY_SUBTITLE}</Text>
        </View>
      </View>
      {/* Scrollable Content */}
      <ImageBackground
        source={ImagePath.ScreenBackground}
        style={commonStyles.backgroundImage}
      >
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'entries' ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab('entries')}
          >
            <Text style={[styles.tabText, activeTab === 'entries' ? styles.activeTabText : styles.inactiveTabText]}>
              {JOURNAL.JOURNAL_ENTRIES}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reflections' ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab('reflections')}
          >
            <Text style={[styles.tabText, activeTab === 'reflections' ? styles.activeTabText : styles.inactiveTabText]}>
              {JOURNAL.QA_REFLECTIONS}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.contentTransparent}>
            {activeTab === 'entries' ? (
              <>
                {journalEntries.length === 0 ? (
                  renderEmptyState('entries')
                ) : (
                  <FlatList
                    data={journalEntries}
                    renderItem={renderJournalEntry}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                  />
                )}
              </>
            ) : (
              <>
                {qaReflections.length === 0 ? (
                  renderEmptyState('reflections')
                ) : (
                  <FlatList
                    data={qaReflections}
                    renderItem={renderQAReflection}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContainer}
                  />
                )}
              </>
            )}
            <View style={{ marginBottom: scale(120) }} />
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Floating Add Button (only for Journal Entries) */}
      {activeTab === 'entries' && (
        <TouchableOpacity style={styles.fab} onPress={handleNewEntry}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: scale(12),
    marginTop: scale(12),
    marginHorizontal: scale(24),
    marginBottom: scale(12),
  },
  tab: {
    flex: 1,
    margin: scale(6),
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
  },
  inactiveTab: {
    backgroundColor: COLORS.SECONDARY,
  },
  tabText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },
  activeTabText: {
    color: COLORS.TEXT_DARK,
  },
  inactiveTabText: {
    color: COLORS.TEXT_DARK,
  },
  privacyContainer: {
    marginTop: scale(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  privacyText: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(2),
  },
  privacySubtext: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  listContainer: {
    paddingTop: scale(16),
  },
  entryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    overflow: 'visible',
    ...commonStyles.cardShadow,
  },
  entryContent: {
    flex: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(8),
    width: '100%',
  },
  entryHeaderSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(8),
    width: '100%',
  },
  menuButtonWrapper: {
    position: 'relative',
    flexShrink: 0,
    alignSelf: 'flex-end',
    zIndex: 10,
  },
  entryTitle: {
    flex: 1,
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    marginRight: scale(8),
    minWidth: 0,
  },
  menuButton: {
    padding: scale(4),
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  menuIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: COLORS.TEXT_DARK,
  },
  tagContainer: {
    marginBottom: scale(12),
    marginTop: scale(6),
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    minHeight: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  entrySnippet: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    marginBottom: scale(8),
    flex: 1,
    marginRight: scale(8),
  },
  entrySnippetSimple: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    flex: 1,
    marginRight: scale(8),
  },
  entrySnippetQA: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
    marginBottom: scale(12),
    marginTop: scale(4),
  },
  entryDate: {
    marginTop: scale(8),
    fontSize: scaleFont(12),
    color: COLORS.TEXT_MUTED,
    fontFamily: 'varela_round_regular',
  },
  menuContainer: {
    position: 'absolute',
    top: scale(20),
    right: 0,
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    paddingVertical: scale(4),
    minWidth: scale(140),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 1000,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
  },
  menuItemDelete: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  menuItemIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(12),
    tintColor: COLORS.TEXT_DARK,
  },
  menuItemIconDelete: {
    width: scale(18),
    height: scale(18),
    tintColor: COLORS.ERROR,
  },
  menuItemText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontFamily: 'varela_round_regular',
  },
  menuItemTextDelete: {
    color: COLORS.ERROR,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(80),
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: scale(16),
    marginHorizontal: scale(24),
    marginTop: scale(24),
    minHeight: scale(300),
  },
  emptyIconContainer: {
    marginBottom: scale(16),
  },
  emptyIcon: {
    fontSize: scaleFont(64),
  },
  emptyText: {
    fontSize: scaleFont(16),
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    paddingHorizontal: scale(40),
    lineHeight: scaleFont(24),
  },
  fab: {
    position: 'absolute',
    right: scale(24),
    bottom: scale(100),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    marginBottom: scale(60),
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    fontSize: scaleFont(32),
    color: COLORS.WHITE,
    fontWeight: '300',
  },
});

export default JournalScreen;

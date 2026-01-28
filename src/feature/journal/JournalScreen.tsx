import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { JOURNAL } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { AppStackParamList } from '../../navigators/types';
import type { JournalEntry, QAReflection } from '../../constants/constantData';
import TabToggle from '../../components/common/TabToggle';
import { DropdownMenu, MenuItem } from '../../components/menu';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchJournalsAsync, fetchReflectionsAsync, deleteJournalAsync, deleteReflectionAsync, downloadJournalPDFAsync, downloadReflectionPDFAsync } from '../../redux/slices/journal/journalSlice';
import { JournalEntry as ApiJournalEntry, ReflectionEntry } from '../../network/services/journalService';
import Toast from 'react-native-toast-message';
import { LoadingModal } from '../../components/modals';

type JournalNavigationProp = StackNavigationProp<AppStackParamList, 'Journal'>;

/**
 * Parse date string from API format "28 Jan 2026, 11:19 AM" to separate date and time
 */
const parseApiDate = (dateString: string): { date: string; time: string } => {
  try {
    // Format: "28 Jan 2026, 11:19 AM"
    const parts = dateString.split(', ');
    if (parts.length === 2) {
      return {
        date: parts[0], // "28 Jan 2026"
        time: parts[1], // "11:19 AM"
      };
    }
    // Fallback: return as is
    return { date: dateString, time: '' };
  } catch (error) {
    return { date: dateString, time: '' };
  }
};

/**
 * Transform API journal entry to component format
 */
const transformJournalEntry = (apiEntry: ApiJournalEntry): JournalEntry => {
  const { date, time } = parseApiDate(apiEntry.created_at);
  return {
    id: apiEntry.id.toString(),
    title: '', // API doesn't provide title, using empty string
    content: apiEntry.content,
    date,
    time,
    createdAt: new Date(apiEntry.created_at),
  };
};

/**
 * Transform API reflection entry to component format
 */
const transformReflectionEntry = (apiEntry: ReflectionEntry): QAReflection => {
  const { date, time } = parseApiDate(apiEntry.created_at);
  return {
    id: apiEntry.id.toString(),
    focusOfAdvice: apiEntry.topic_title,
    date,
    time,
    questions: apiEntry.reflection_question ? [apiEntry.reflection_question] : [],
    reflection: apiEntry.reflection_text,
    createdAt: new Date(apiEntry.created_at),
    tag: apiEntry.phase_name,
  };
};

const JournalScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<JournalNavigationProp>();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'entries' | 'reflections'>('entries');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  // Redux state
  const { journals, reflections, isLoadingJournals, isLoadingReflections, isDeletingJournal, isDeletingReflection, isDownloadingJournalPDF, isDownloadingReflectionPDF } = useAppSelector(
    (state) => state.journal
  );

  // Transform API data to component format
  const journalEntries = useMemo(() => journals.map(transformJournalEntry), [journals]);
  const qaReflections = useMemo(() => reflections.map(transformReflectionEntry), [reflections]);

  // Fetch data on mount and when tab changes
  useEffect(() => {
    if (activeTab === 'entries') {
      dispatch(fetchJournalsAsync());
    } else {
      dispatch(fetchReflectionsAsync());
    }
  }, [activeTab, dispatch]);

  // Reload journals when screen comes into focus (e.g., after creating a new entry)
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'entries') {
        dispatch(fetchJournalsAsync());
      }
    }, [activeTab, dispatch])
  );

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
    if (isDeletingJournal) return; // Prevent multiple delete operations
    
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setMenuVisible(null),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const journalId = parseInt(entryId, 10);
              await dispatch(deleteJournalAsync(journalId)).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Journal entry deleted successfully',
                position: 'bottom',
                visibilityTime: 3000,
              });
              setMenuVisible(null);
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error || 'Failed to delete journal entry',
                position: 'bottom',
                visibilityTime: 3000,
              });
              setMenuVisible(null);
            }
          },
        },
      ]
    );
  };

  const handleDownloadEntry = async (entryId: string) => {
    if (isDownloadingJournalPDF) return; // Prevent multiple download operations
    
    try {
      const journalId = parseInt(entryId, 10);
      const result = await dispatch(downloadJournalPDFAsync(journalId)).unwrap();
      
      if (result.pdfUrl) {
        const canOpen = await Linking.canOpenURL(result.pdfUrl);
        if (canOpen) {
          await Linking.openURL(result.pdfUrl);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Opening PDF in browser...',
            position: 'bottom',
            visibilityTime: 2000,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Cannot open PDF URL',
            position: 'bottom',
            visibilityTime: 3000,
          });
        }
      }
      setMenuVisible(null);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Failed to download PDF',
        position: 'bottom',
        visibilityTime: 3000,
      });
      setMenuVisible(null);
    }
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
        onPress={() => {
          handleViewEntry(item.id);
          setMenuVisible(null);
        }}
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
                <DropdownMenu
                  items={[
                    {
                      icon: ImagePath.EditIcon,
                      text: JOURNAL.EDIT,
                      onPress: () => {
                        handleEditEntry(item.id);
                        setMenuVisible(null);
                      },
                    },
                    {
                      icon: ImagePath.DownloadIcon,
                      text: JOURNAL.DOWNLOAD,
                      onPress: () => {
                        handleDownloadEntry(item.id);
                        setMenuVisible(null);
                      },
                    },
                    {
                      icon: ImagePath.DeleteIcon,
                      text: JOURNAL.DELETE,
                      onPress: () => {
                        handleDeleteEntry(item.id);
                        setMenuVisible(null);
                      },
                      isDelete: true,
                    },
                  ]}
                />
              )}
            </View>
          <View style={styles.entryHeaderSimple}>
            <Text style={styles.entrySnippetSimple}>{snippet}</Text>
          </View>
          <Text style={styles.entryDate}>{item.date}, {item.time}</Text>
        </View>
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
          onPress={() => {
            handleViewReflection(item.id);
            setMenuVisible(null);
          }}
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
                  <DropdownMenu
                    items={[
                      {
                        icon: ImagePath.EditIcon,
                        text: JOURNAL.EDIT,
                        onPress: () => {
                          handleEditReflection(item.id);
                          setMenuVisible(null);
                        },
                      },
                      {
                        icon: ImagePath.DownloadIcon,
                        text: JOURNAL.DOWNLOAD,
                        onPress: async () => {
                          if (isDownloadingReflectionPDF) return; // Prevent multiple download operations
                          
                          try {
                            const reflectionId = parseInt(item.id, 10);
                            const result = await dispatch(downloadReflectionPDFAsync(reflectionId)).unwrap();
                            
                            if (result.pdfUrl) {
                              const canOpen = await Linking.canOpenURL(result.pdfUrl);
                              if (canOpen) {
                                await Linking.openURL(result.pdfUrl);
                                Toast.show({
                                  type: 'success',
                                  text1: 'Success',
                                  text2: 'Opening PDF in browser...',
                                  position: 'bottom',
                                  visibilityTime: 2000,
                                });
                              } else {
                                Toast.show({
                                  type: 'error',
                                  text1: 'Error',
                                  text2: 'Cannot open PDF URL',
                                  position: 'bottom',
                                  visibilityTime: 3000,
                                });
                              }
                            }
                            setMenuVisible(null);
                          } catch (error: any) {
                            Toast.show({
                              type: 'error',
                              text1: 'Error',
                              text2: error || 'Failed to download PDF',
                              position: 'bottom',
                              visibilityTime: 3000,
                            });
                            setMenuVisible(null);
                          }
                        },
                      },
                      {
                        icon: ImagePath.DeleteIcon,
                        text: JOURNAL.DELETE,
                        onPress: () => {
                          if (isDeletingReflection) return; // Prevent multiple delete operations
                          const reflectionId = parseInt(item.id, 10);
                          Alert.alert(
                            'Delete Reflection',
                            'Are you sure you want to delete this reflection? This action cannot be undone.',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => setMenuVisible(null),
                              },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                  try {
                                    await dispatch(deleteReflectionAsync(reflectionId)).unwrap();
                                    Toast.show({
                                      type: 'success',
                                      text1: 'Success',
                                      text2: 'Reflection deleted successfully',
                                      position: 'bottom',
                                      visibilityTime: 3000,
                                    });
                                    setMenuVisible(null);
                                  } catch (error: any) {
                                    Toast.show({
                                      type: 'error',
                                      text1: 'Error',
                                      text2: error || 'Failed to delete reflection',
                                      position: 'bottom',
                                      visibilityTime: 3000,
                                    });
                                    setMenuVisible(null);
                                  }
                                },
                              },
                            ]
                          );
                        },
                        isDelete: true,
                      },
                    ]}
                  />
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
      </>
    );
  };

  const renderEmptyState = (type: 'entries' | 'reflections') => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
       <Image source={ImagePath.EmptyJournalIcon} style={styles.emptyIcon} resizeMode="contain" />
      </View>
      <Text style={styles.emptyText}>
        {type === 'entries' ? JOURNAL.NO_ENTRIES_YET : JOURNAL.NO_REFLECTIONS_YET}
      </Text>
    </View>
  );

  const isLoading = isDeletingJournal || isDeletingReflection || isDownloadingJournalPDF || isDownloadingReflectionPDF;

  // Get loading message
  const getLoadingMessage = () => {
    if (isDeletingJournal) return 'Deleting journal entry...';
    if (isDeletingReflection) return 'Deleting reflection...';
    if (isDownloadingJournalPDF) return 'Downloading journal PDF...';
    if (isDownloadingReflectionPDF) return 'Downloading reflection PDF...';
    return 'Loading...';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading}
        message={getLoadingMessage()}
      />

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
        <TabToggle
          options={[
            { label: JOURNAL.JOURNAL_ENTRIES, value: 'entries' },
            { label: JOURNAL.QA_REFLECTIONS, value: 'reflections' },
          ]}
          selectedValue={activeTab}
          onValueChange={(value) => setActiveTab(value as 'entries' | 'reflections')}
          variant="journal"
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.contentTransparent}>
            {activeTab === 'entries' ? (
              <>
                {isLoadingJournals ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                  </View>
                ) : journalEntries.length === 0 ? (
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
                {isLoadingReflections ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                  </View>
                ) : qaReflections.length === 0 ? (
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(80),
    backgroundColor: 'transparent'
  },
  emptyIconContainer: {
    marginBottom: scale(16),
  },
  emptyIcon: {
    width: scale(50),
    height: scale(50),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(80),
    minHeight: scale(300),
  },
});

export default JournalScreen;

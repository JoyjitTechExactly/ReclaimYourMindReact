import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

export interface TabOption {
  label: string;
  value: string;
}

interface TabToggleProps {
  options: TabOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  variant?: 'default' | 'journal'; // 'journal' uses journal-specific styling
}

const TabToggle: React.FC<TabToggleProps> = ({
  options,
  selectedValue,
  onValueChange,
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  variant = 'default',
}) => {
  const isJournalVariant = variant === 'journal';

  const defaultContainerStyle: ViewStyle = isJournalVariant
    ? {
        marginTop: scale(12),
        marginHorizontal: scale(24),
        marginBottom: scale(12),
      }
    : {};

  const defaultTabStyle: ViewStyle = isJournalVariant
    ? {
        margin: scale(6),
        paddingVertical: scale(16),
        borderRadius: scale(12),
      }
    : {
        paddingVertical: scale(10),
        paddingHorizontal: scale(16),
        borderRadius: scale(6),
      };

  const defaultContainerBackground = isJournalVariant
    ? COLORS.SECONDARY
    : COLORS.SECONDARY;

  const defaultContainerBorderRadius = isJournalVariant
    ? scale(12)
    : scale(8);

  const defaultContainerPadding = isJournalVariant
    ? 0
    : scale(4);

  // Safety check for options
  if (!options || !Array.isArray(options) || options.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: defaultContainerBackground,
          borderRadius: defaultContainerBorderRadius,
          padding: defaultContainerPadding,
        },
        defaultContainerStyle,
        containerStyle,
      ]}
    >
      {options.map((option) => {
        const isActive = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.tab,
              defaultTabStyle,
              isActive
                ? [
                    styles.activeTab,
                    isJournalVariant ? styles.journalActiveTab : {},
                    activeTabStyle,
                  ]
                : [
                    isJournalVariant ? styles.journalInactiveTab : {},
                    tabStyle,
                  ],
            ]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive
                  ? [
                      styles.activeTabText,
                      isJournalVariant ? styles.journalActiveText : {},
                      activeTextStyle,
                    ]
                  : [
                      isJournalVariant ? styles.journalInactiveText : {},
                      textStyle,
                    ],
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  journalActiveTab: {
    backgroundColor: COLORS.WHITE,
  },
  journalInactiveTab: {
    backgroundColor: COLORS.SECONDARY,
  },
  tabText: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_LIGHT,
    fontFamily: 'varela_round_regular',
  },
  activeTabText: {
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  journalActiveText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  journalInactiveText: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_DARK,
  },
});

export default TabToggle;


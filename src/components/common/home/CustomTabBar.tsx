import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../../utils/scaling';
import { COLORS } from '../../../constants/colors';
import { ImagePath } from '../../../constants/imagePath';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { key: 'Home', label: 'Home', icon: ImagePath.HomeIcon },
    { key: 'Resources', label: 'Resources', icon: ImagePath.ResourcesIcon },
    { key: 'Journal', label: 'Journal', icon: ImagePath.JournalIcon },
    { key: 'Profile', label: 'Profile', icon: ImagePath.ProfileIcon },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index].key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index].name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  { tintColor: isFocused ? COLORS.PRIMARY : COLORS.GRAY }
                ]}
                resizeMode="contain"
              />
              <Text style={[
                styles.label,
                { color: isFocused ? COLORS.PRIMARY : COLORS.GRAY }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(20),
    marginBottom: scale(10),
    borderRadius: scale(50),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    minHeight: scale(70),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(4),
  },
  icon: {
    width: scale(22),
    height: scale(22),
    marginBottom: scale(6),
  },
  label: {
    fontSize: scaleFont(12),
    fontWeight: '500',
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
});

export default CustomTabBar;

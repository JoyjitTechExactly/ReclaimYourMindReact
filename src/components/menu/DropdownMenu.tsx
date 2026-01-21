import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

export interface MenuItem {
  icon: ImageSourcePropType;
  text: string;
  onPress: () => void;
  isDelete?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => {
  return (
    <View style={styles.menuContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuItem, item.isDelete && styles.menuItemDelete]}
          onPress={item.onPress}
        >
          <Image
            source={item.icon}
            style={[styles.menuItemIcon, item.isDelete && styles.menuItemIconDelete]}
            resizeMode="contain"
          />
          <Text style={[styles.menuItemText, item.isDelete && styles.menuItemTextDelete]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default DropdownMenu;


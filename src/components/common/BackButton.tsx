import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { scale } from '../../utils/scaling';
import { ImagePath } from '../../constants/imagePath';
import { COLORS } from '../../constants/colors';


interface BackButtonProps {
  onPress: () => void;
  size?: number;
  bottomMargin?: number;
  color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, size = 36, bottomMargin = 32, color = COLORS.TEXT_PRIMARY }) => {
  return (
    <TouchableOpacity style={[styles.backButton, { width: scale(size), height: scale(size), marginBottom: scale(bottomMargin) }]} onPress={onPress}>
      <Image 
        source={ImagePath.BackArrow} 
        style={{
            width: scale(size), 
            height: scale(size),
            tintColor: color,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default BackButton;

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ImagePath } from '../constants/imagePath';
import { scale } from '../utils/scaling';

interface BackButtonProps {
  onPress: () => void;
  size?: number;
  bottomMargin?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, size = 36, bottomMargin = 32 }) => {
  return (
    <TouchableOpacity style={[styles.backButton, { width: scale(size), height: scale(size), marginBottom: scale(bottomMargin) }]} onPress={onPress}>
      <Image 
        source={ImagePath.BackArrow} 
        style={{
            width: scale(size), 
            height: scale(size)
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

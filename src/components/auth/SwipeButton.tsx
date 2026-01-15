import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
} from 'react-native';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { SWIPE_BUTTON } from '../../constants/strings';
import { ImagePath } from '../../constants/imagePath';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeButtonProps {
  onSwipeComplete: () => void;
  text?: string;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({
  onSwipeComplete,
  text = SWIPE_BUTTON.DEFAULT_TEXT,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  const panX = useRef(new Animated.Value(0)).current;
  const buttonWidth = screenWidth - scale(40);
  const swipeThreshold = buttonWidth * 0.7;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !isComplete,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx <= swipeThreshold) {
          panX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= swipeThreshold) {
          // Swipe completed
          Animated.spring(panX, {
            toValue: buttonWidth - scale(60),
            useNativeDriver: false,
          }).start(() => {
            setIsComplete(true);
            onSwipeComplete();
          });
        } else {
          // Snap back
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const arrowStyle = {
    transform: [{ translateX: panX }],
  };

  const progressStyle = {
    width: panX.interpolate({
      inputRange: [0, swipeThreshold],
      outputRange: [0, buttonWidth],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.swipeContainer, { width: buttonWidth }]}>
        {/* Progress background */}
        <Animated.View style={[styles.progressBackground, progressStyle]} />
        
        {/* Swipe text */}
        <Text style={styles.swipeText}>{text}</Text>
        
        {/* Arrow button */}
        <Animated.View
          style={[styles.arrowButton, arrowStyle]}
          {...panResponder.panHandlers}
        >
          <Image 
            source={ImagePath.SwipeRight}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  swipeContainer: {
    height: scale(56),
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: scale(28),
    zIndex: 1,
  },
  swipeText: {
    fontSize: scaleFont(14),
    fontWeight: '400',
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    position: 'absolute',
    zIndex: 2,
  },
  arrowButton: {
    position: 'absolute',
    left: scale(4),
    width: scale(48),
    height: scale(48),
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.GRAY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 3,
  },
  arrowImage: {
    width: scale(48),
    height: scale(48)
  },
});

export default SwipeButton;

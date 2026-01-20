import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Image, ImageBackground } from 'react-native';
import { scale, scaleFont } from '../../../utils/scaling';
import { COLORS } from '../../../constants/colors';
import { getThumbnailFromUrl } from '../../../utils/youtubeUtils';
import { ImagePath } from '../../../constants/imagePath';

export type VideoPlayerVariant = 'main' | 'card';

interface VideoPlayerProps {
  title?: string;
  duration?: string;
  videoUrl?: string; // YouTube video URL
  thumbnailUrl?: string; // Optional custom thumbnail URL (overrides YouTube thumbnail)
  variant?: VideoPlayerVariant;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  showFullscreenIcon?: boolean; // For card variant
  currentTime?: string; // For main variant (e.g., "0:00")
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  duration,
  videoUrl,
  thumbnailUrl,
  variant = 'main',
  onPress,
  containerStyle,
  showFullscreenIcon = true,
  currentTime,
}) => {
  // Get thumbnail URL - prioritize custom thumbnail, then YouTube thumbnail, then fallback to dark background
  const thumbnail = thumbnailUrl || (videoUrl ? getThumbnailFromUrl(videoUrl) : null);

  // Both variants now use the same base structure with thumbnail
  const renderVideoContent = () => (
    <>
      {/* Thumbnail Image */}
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.thumbnailPlaceholder} />
      )}
      
      {/* Dark overlay for better text visibility */}
      <View style={styles.overlay} />

      {/* Play Button - Centered */}
      <View style={styles.playButtonContainer}>
        <View style={styles.playButton}>
          <Image source={ImagePath.ContinueWhereILeftOff} style={styles.playIcon} />
        </View>
      </View>

      {/* Title and Duration - Bottom Left */}
      {(title || duration) && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.titleText}>{title}</Text>}
          {duration && (
            <Text style={styles.durationText}>
              {currentTime ? `${currentTime} / ` : ''}
              {duration}
            </Text>
          )}
        </View>
      )}

      {/* Fullscreen Icon - Bottom Right (for card variant) */}
      {variant === 'card' && showFullscreenIcon && (
        <View style={styles.fullscreenIconContainer}>
          <Text style={styles.fullscreenIcon}>⛶</Text>
        </View>
      )}
    </>
  );

  const containerStyles = variant === 'card' 
    ? [styles.cardContainer, containerStyle]
    : [styles.mainContainer, containerStyle];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {renderVideoContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Common container styles
  mainContainer: {
    width: '100%',
    height: scale(200),
    borderRadius: scale(12),
    marginBottom: scale(24),
    overflow: 'hidden',
    position: 'relative',
  },
  cardContainer: {
    width: '100%',
    height: scale(200), // Same height as main variant for consistency
    borderRadius: scale(12),
    marginBottom: scale(16),
    overflow: 'hidden',
    position: 'relative',
  },

  // Thumbnail and overlay
  thumbnailImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.TEXT_DARK,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  // Play button - centered
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  playButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: scale(24),
    height: scale(24),
    objectFit: 'contain',
  },

  // Title and duration - bottom left
  titleContainer: {
    position: 'absolute',
    bottom: scale(16),
    left: scale(16),
    zIndex: 2,
    maxWidth: '70%',
  },
  titleText: {
    fontSize: scaleFont(14),
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
    fontWeight: '600',
  },
  durationText: {
    fontSize: scaleFont(12),
    color: COLORS.WHITE,
    fontFamily: 'varela_round_regular',
    opacity: 0.9,
  },

  // Fullscreen icon - bottom right (for card variant)
  fullscreenIconContainer: {
    position: 'absolute',
    bottom: scale(12),
    right: scale(12),
    zIndex: 2,
  },
  fullscreenIcon: {
    fontSize: scaleFont(18),
    color: COLORS.WHITE,
    opacity: 0.8,
  },
});

export default VideoPlayer;


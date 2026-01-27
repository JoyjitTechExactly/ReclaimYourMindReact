import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors'; 
import { getYouTubeVideoId } from '../../utils/youtubeUtils';

// Import YoutubePlayer
// Note: This requires react-native-webview to be properly linked
// After installing, rebuild the app:
// - iOS: cd ios && pod install && cd .. && npx react-native run-ios
// - Android: npx react-native run-android
import YoutubePlayer from 'react-native-youtube-iframe';

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
  // Get YouTube video ID for embedding
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;

  // Show YouTube player directly if videoId is available
  if (videoId && YoutubePlayer) {
    const containerHeight = variant === 'card' ? scale(200) : scale(200);
    return (
      <View style={[variant === 'card' ? styles.cardContainer : styles.mainContainer, containerStyle]}>
        <View style={styles.videoWrapper}>
          <YoutubePlayer
            height={containerHeight}
            videoId={videoId}
            play={false}
            onChangeState={(state: string) => {
              // Handle player state changes if needed
            }}
            webViewStyle={{ 
              opacity: 0.99,
            }}
            webViewProps={{
              allowsFullscreenVideo: true,
              style: {
                width: '100%',
                height: '100%',
              },
            }}
          />
        </View>
      </View>
    );
  }

  // Fallback: if no videoId or YoutubePlayer not available, show placeholder
  return (
    <View style={[variant === 'card' ? styles.cardContainer : styles.mainContainer, containerStyle]}>
      <View style={styles.thumbnailPlaceholder}>
        {onPress && (
          <TouchableOpacity style={styles.fallbackButton} onPress={onPress}>
            <Text style={styles.fallbackButtonText}>Video not available</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    tintColor: COLORS.WHITE,
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
  
  // Video player styles
  videoWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.TEXT_DARK,
  },
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: COLORS.TEXT_DARK,
  },
  closeButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },
  fallbackButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackButtonText: {
    color: COLORS.WHITE,
    fontSize: scaleFont(14),
    fontFamily: 'varela_round_regular',
  },
});

export default VideoPlayer;


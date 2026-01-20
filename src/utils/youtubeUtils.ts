/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID)
 * @returns YouTube video ID or null if not a valid YouTube URL
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Generates YouTube thumbnail URL from video ID
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality: 'maxresdefault' (highest), 'hqdefault' (high), 'mqdefault' (medium), 'sddefault' (standard)
 * @returns YouTube thumbnail URL
 */
export const getYouTubeThumbnailUrl = (
  videoId: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault' = 'maxresdefault'
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Gets YouTube thumbnail URL directly from YouTube video URL
 * @param url - YouTube video URL
 * @param quality - Thumbnail quality
 * @returns YouTube thumbnail URL or null if not a valid YouTube URL
 */
export const getThumbnailFromUrl = (
  url: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault' = 'maxresdefault'
): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return getYouTubeThumbnailUrl(videoId, quality);
};


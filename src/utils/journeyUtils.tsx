import React from 'react';
import { Image, ImageStyle } from 'react-native';
import { ImagePath } from '../constants/imagePath';
import { scale } from './scaling';

export type JourneyStatus = 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'LOCKED';

interface StatusIconProps {
  status: JourneyStatus | string;
  style?: ImageStyle;
  size?: number;
}

/**
 * Renders a status icon for journey items based on their status
 * @param status - The status of the journey item
 * @param style - Optional custom style for the icon
 * @param size - Optional size for the icon (default: 16)
 * @returns React component with the appropriate status icon
 */
export const renderJourneyStatusIcon = ({ 
  status, 
  style, 
  size = 16 
}: StatusIconProps): React.ReactElement | null => {
  const iconStyle = [
    {
      width: scale(size),
      height: scale(size),
    },
    style,
  ];

  switch (status) {
    case 'COMPLETED':
      return (
        <Image 
          source={ImagePath.JourneyComplete} 
          style={iconStyle}
          resizeMode="contain"
        />
      );
    case 'IN_PROGRESS':
      return (
        <Image 
          source={ImagePath.JourneyInProgress} 
          style={iconStyle}
          resizeMode="contain"
        />
      );
    case 'NOT_STARTED':
      return (
        <Image 
          source={ImagePath.JourneyPending} 
          style={iconStyle}
          resizeMode="contain"
        />
      );
    default:
      return null;
  }
};

/**
 * Gets the status text for a journey status
 * @param status - The status of the journey item
 * @returns Human-readable status text
 */
export const getJourneyStatusText = (status: JourneyStatus | string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'NOT_STARTED':
      return 'Not Started';
    case 'LOCKED':
      return 'Locked';
    default:
      return 'Not Started';
  }
};


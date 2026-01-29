import React from 'react';
import { useWindowDimensions, TextStyle } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

interface HtmlRendererProps {
  html: string;
  contentWidth?: number;
  textColor?: string;
  fontSize?: number;
  lineHeight?: number;
  baseStyle?: TextStyle;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({
  html,
  contentWidth,
  textColor = COLORS.TEXT_PRIMARY,
  fontSize = scaleFont(14),
  lineHeight = scaleFont(22),
  baseStyle,
}) => {
  const { width } = useWindowDimensions();
  const calculatedContentWidth = contentWidth ?? width - scale(48);

  const defaultBaseStyle: TextStyle = {
    fontSize,
    lineHeight,
    color: textColor,
    fontFamily: 'varela_round_regular',
    ...baseStyle,
  };

  const tagsStyles = {
    p: {
      marginBottom: scale(12),
      marginTop: 0,
      color: textColor,
      fontFamily: 'varela_round_regular',
      fontSize,
      lineHeight,
    },
    h1: {
      fontSize: scaleFont(24),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(12),
      marginTop: scale(16),
    },
    h2: {
      fontSize: scaleFont(20),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(10),
      marginTop: scale(14),
    },
    h3: {
      fontSize: scaleFont(18),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(8),
      marginTop: scale(12),
    },
    h4: {
      fontSize: scaleFont(16),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(8),
      marginTop: scale(10),
    },
    h5: {
      fontSize: scaleFont(15),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(6),
      marginTop: scale(8),
    },
    h6: {
      fontSize: scaleFont(14),
      fontWeight: '600' as const,
      color: COLORS.PRIMARY,
      fontFamily: 'varela_round_regular',
      marginBottom: scale(6),
      marginTop: scale(8),
    },
    ul: {
      marginBottom: scale(12),
      marginTop: 0,
      paddingLeft: scale(20),
    },
    ol: {
      marginBottom: scale(12),
      marginTop: 0,
      paddingLeft: scale(20),
    },
    li: {
      marginBottom: scale(6),
      color: textColor,
      fontFamily: 'varela_round_regular',
      fontSize,
      lineHeight,
    },
    strong: {
      fontWeight: '600' as const,
      color: textColor,
      fontFamily: 'varela_round_regular',
    },
    em: {
      fontStyle: 'italic' as const,
      color: textColor,
      fontFamily: 'varela_round_regular',
    },
    span: {
      color: textColor,
      fontFamily: 'varela_round_regular',
    },
    div: {
      marginBottom: scale(8),
    },
  };

  return (
    <RenderHTML
      contentWidth={calculatedContentWidth}
      source={{ html }}
      baseStyle={defaultBaseStyle}
      tagsStyles={tagsStyles}
    />
  );
};

export default HtmlRenderer;


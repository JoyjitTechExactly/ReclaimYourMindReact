import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { scale, scaleHeight, scaleFont } from '../utils/scaling';

// Common styles that can be reused across components
export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
  },
  contentCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  welcomeText: {
    fontSize: scaleFont(16),
    color: '#666666',
    fontFamily: 'varela_round_regular',
    marginBottom: scale(2),
  },
  userName: {
    fontSize: scaleFont(28),
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'varela_round_regular',
    marginBottom: scale(4),
  },
  headerSubtitle: {
    fontSize: scaleFont(14),
    color: '#888888',
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(20),
  },
  // Text styles
  title: {
    fontSize: scaleFont(26),
    fontWeight: 600,
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  titleCentered: {
    fontSize: scaleFont(26),
    fontWeight: 600,
    color: COLORS.PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  blackTitle: {
    fontSize: scaleFont(26),
    fontWeight: 600,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  blaclkTitleCentered: {
    fontSize: scaleFont(26),
    fontWeight: 600,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    marginTop: scale(6),
  },
  subtitleCentered: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 400,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  subtitle18Black: {
    fontSize: scaleFont(18),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    marginTop: scale(6),
  },
  subtitle18BlackCentered: {
    fontSize: scaleFont(18),
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 400,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  subtitleGrey: {
    fontSize: scaleFont(14),
     color: COLORS.TEXT_SECONDARY,
    fontFamily: 'varela_round_regular',
    marginTop: scale(6),
  },
  subtitleGreyCentered: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 400,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  subtitle18GrayCentered: {
    fontSize: scaleFont(18),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 400,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  description: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 400,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
    lineHeight: scaleFont(24),
    paddingHorizontal: scale(20),
  },
  textPrimary: {
    fontSize: scaleFont(16),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  textSmall: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
  },
  textSmallCentered: {
    fontSize: scaleFont(14),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    textAlign: 'center',
  },
  textTiny: {
    fontSize: scaleFont(12),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    lineHeight: scaleFont(16),
  },

  // Form styles
  form: {
    flex: 1,
  },
  inputContainer: {
  },
  inputLabel: {
    fontSize: scaleFont(14),
    fontWeight: '400',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'varela_round_regular',
    marginBottom: scale(8),
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderWidth: scale(1),
    borderColor: COLORS.SECONDARY,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    fontSize: scaleFont(16),
    fontFamily: 'varela_round_regular',
    color: COLORS.TEXT_PRIMARY,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: scale(50),
  },
  eyeIcon: {
    position: 'absolute',
    right: scale(16),
    top: '50%',
    transform: [{ translateY: -scaleFont(12) }],
  },
  eyeIconText: {
    fontSize: scaleFont(20),
    fontFamily: 'varela_round_regular',
  },

  // Button styles
  buttonContainer: {
    width: '100%',
    gap: scale(16),
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: scaleFont(14),
    fontWeight: '600',
    fontFamily: 'varela_round_regular',
  },

  // Card/Container styles
  card: {
    backgroundColor: COLORS.WHITE,
    borderWidth: scale(1),
    borderColor: COLORS.SECONDARY,
    borderRadius: scale(12),
    padding: scale(16),
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(12),
    padding: scale(16),
    paddingHorizontal: scale(20),
  },

  // Icon styles
  smallIcon: {
    width: scale(24),
    height: scale(24),
    marginRight: scale(12),
  },
  mediumIcon: {
    width: scale(80),
    height: scale(80),
  },

  // Layout styles
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },

  // Margin utilities
  mb8: {
    marginBottom: scale(8),
  },
  mb12: {
    marginBottom: scale(12),
  },
  mb16: {
    marginBottom: scale(16),
  },
  mb20: {
    marginBottom: scale(20),
  },
  mb24: {
    marginBottom: scale(24),
  },
  mb28: {
    marginBottom: scale(28),
  },
  mb32: {
    marginBottom: scale(32),
  },
  mb36: {
    marginBottom: scale(36),
  },
  mb40: {
    marginBottom: scale(40),
  },
  mb44: {
    marginBottom: scale(44),
  },
  mb48: {
    marginBottom: scale(48),
  },
  mb52: {
    marginBottom: scale(52),
  },
  mb56: {
    marginBottom: scale(56),
  },
  mb60: {
    marginBottom: scale(60),
  },
  mt8: {
    marginTop: scale(8),
  },
  mt16: {
    marginTop: scale(16),
  },
  mt24: {
    marginTop: scale(24),
  },
  mt32: {
    marginTop: scale(32),
  },

  // Gap utilities
  gap8: {
    gap: scale(8),
  },
  gap16: {
    gap: scale(16),
  },
  gap24: {
    gap: scale(24),
  },

  // Padding utilities
  p16: {
    padding: scale(16),
  },
  p20: {
    padding: scale(20),
  },
  ph16: {
    paddingHorizontal: scale(16),
  },
  ph20: {
    paddingHorizontal: scale(20),
  },
  pv14: {
    paddingVertical: scale(14),
  },

  // Additional common styles for HomeScreen
  cardShadow: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButtonSmall: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(6),
    justifyContent: 'center',
  },
  progressBar: {
    height: scale(8),
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PROGRESS_BAR,
    borderRadius: 4,
  },
  fixedHeader: {
    height: scale(130),
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
    paddingBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_HEADER,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(24)
  },
});

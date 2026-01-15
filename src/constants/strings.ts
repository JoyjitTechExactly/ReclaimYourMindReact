// Onboarding Screen
export const ONBOARDING = {
  TITLE: 'Reclaim Your Mind',
  SUBTITLE: 'from Toxic Relationships',
  AWARENESS_LINE1: 'Awareness. Healing. Empowerment.',
  AWARENESS_LINE2: 'A safe space for healing, reflection, and growth — always at your own pace.',
  ALREADY_HAVE_ACCOUNT: 'Already have an account?',
  PRIVACY_TEXT_LINE1: 'Your privacy and safety are our priority.',
  PRIVACY_TEXT_LINE2: 'All data is encrypted and secure.',
  CREATE_ACCOUNT: 'Create an Account',
  LOG_IN: 'Log In',
} as const;

// Sign In Screen
export const SIGN_IN = {
  TITLE: 'Welcome Back',
  SUBTITLE: 'Sign in to continue your journey',
  EMAIL_LABEL: 'Email',
  EMAIL_PLACEHOLDER: 'Enter your email',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  FORGOT_PASSWORD: 'Forgot Password?',
  LOGIN_BUTTON: 'Log In',
} as const;

// Sign Up Screen
export const SIGN_UP = {
  TITLE: 'Your Safe Space',
  SUBTITLE: 'Create your account to begin your journey of healing and empowerment',
  FULL_NAME_LABEL: 'Full Name',
  FULL_NAME_PLACEHOLDER: 'Enter your full name',
  EMAIL_LABEL: 'Email',
  EMAIL_PLACEHOLDER: 'Enter your email',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm your password',
  PASSWORD_REQUIREMENTS_TITLE: 'Password must contain:',
  REQUIREMENT_LENGTH: 'At least 8 characters',
  REQUIREMENT_UPPERCASE: 'One uppercase letter',
  REQUIREMENT_LOWERCASE: 'One lowercase letter',
  REQUIREMENT_NUMBER: 'One number',
  REQUIREMENT_SPECIAL: 'One special character',
  CREATE_ACCOUNT: 'Create Account',
} as const;

// Auth Input Component
export const AUTH_INPUT = {
  EMAIL_LABEL: 'Email',
  PASSWORD_LABEL: 'Password',
} as const;

// Password Input Component
export const PASSWORD_INPUT = {
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  PASSWORD_REQUIREMENTS_TITLE: 'Password must contain:',
  REQUIREMENT_LENGTH: 'At least 8 characters',
  REQUIREMENT_UPPERCASE: 'One uppercase letter',
  REQUIREMENT_LOWERCASE: 'One lowercase letter',
  REQUIREMENT_NUMBER: 'One number',
  REQUIREMENT_SPECIAL: 'One special character',
} as const;

// App Navigation
export const APP_NAVIGATION = {
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  HOME_WELCOME: 'Welcome to your safe space',
  PROFILE_DESCRIPTION: 'Manage your profile',
  SETTINGS_DESCRIPTION: 'App settings and preferences',
} as const;

// Auth Navigation
export const AUTH_NAVIGATION = {
  WELCOME: 'Welcome',
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
} as const;

// Error Messages
export const ERRORS = {
  FILL_ALL_FIELDS: 'Please fill in all fields',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  PASSWORD_REQUIREMENTS: 'Password does not meet all requirements',
} as const;

// Eye Icons for Password Visibility
export const ICONS = {
  EYE_OPEN: '👁️',
  EYE_CLOSED: '👁️‍🗨️',
  HOME: '🏠',
  PROFILE: '👤',
  SETTINGS: '⚙️',
} as const;
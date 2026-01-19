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

// Forgot Password Screen
export const FORGOT_PASSWORD = {
  TITLE: 'Reset Password',
  SUBTITLE: 'Enter your email or phone number to reset your password',
  EMAIL_LABEL: 'Email',
  EMAIL_PLACEHOLDER: 'Enter your email',
  INFO_TEXT: "We'll send you a 6-digit verification code to reset your password securely.",
  SEND_CODE_BUTTON: 'Send Reset Code',
} as const;

// OTP Screen
export const OTP_CONSTANTS = {
  TITLE: 'Verify Your Account',
  SUBTITLE: "We've sent a 6-digit verification code to your email. Please enter it below to continue.",
  VERIFY_BUTTON: 'Verify Code',
  RESEND_TEXT: "Didn't receive the code?",
} as const;

// Reset Password Screen
export const RESET_PASSWORD = {
  TITLE: 'Reset Password',
  SUBTITLE: 'Create your new password',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Create a password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm your password',
  REQUIREMENT_LENGTH: 'At least 8 characters',
  REQUIREMENT_UPPERCASE: 'One uppercase letter',
  REQUIREMENT_LOWERCASE: 'One lowercase letter',
  REQUIREMENT_NUMBER: 'One number',
  REQUIREMENT_SPECIAL: 'One special character',
  SAVE_BUTTON: 'Save New Password',
} as const;

// Password Confirmation Screen
export const PASSWORD_CONFIRMATION = {
  TITLE: 'Password Created Successfully!',
  SUBTITLE: 'Your password has been reset successfully. You can now log in with your new password.',
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
  PASSWORD_PLACEHOLDER: 'Create a password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm your password',
  PASSWORD_REQUIREMENTS_TITLE: 'Password must contain:',
  REQUIREMENT_LENGTH: 'At least 8 characters',
  REQUIREMENT_UPPERCASE: 'One uppercase letter',
  REQUIREMENT_LOWERCASE: 'One lowercase letter',
  REQUIREMENT_NUMBER: 'One number',
  REQUIREMENT_SPECIAL: 'One special character',
  CREATE_ACCOUNT: 'Create Account',
  START_JOURNEY: {
    TITLE: 'Your Empowerment Journey',
    SUBTITLE: 'This journey will help you identify emotional abuse, process your feelings, learn healthy relationship strategies, and move toward growth and healing.',
    GET_STARTED_BUTTON: 'Start My Journey',
    FOOTER_TEXT: 'You decide the pace. Nothing here is rushed.',
  },
  CONFIRMATION: {
    TITLE: 'A Final Step Before We Get Started',
    SUBTITLE: 'This is an educational space to better understand emotionally abusive behaviors and to learn more effective coping strategies.',
    DESCRIPTION: 'If you are in crisis or need immediate help, please reach out to a trusted professional or local hotline.',
    CONTINUE_BUTTON: 'Swipe to Begin Your Journey',
    DISCLAIMER: 'Your journey to healing starts here. Take your time and be kind to yourself.',
    BUTTON_TEXT: 'Swipe to Begin Your Journey',
    FOOTER_TEXT: 'You decide the pace. Nothing here is rushed.',
  },
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
  RESOURCES: 'Resources',
  JOURNAL: 'Journal',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  HOME_WELCOME: 'Welcome to your safe space',
  RESOURCES_DESCRIPTION: 'Access helpful resources and tools',
  JOURNAL_DESCRIPTION: 'Document your thoughts and progress',
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

// Swipe Button Component
export const SWIPE_BUTTON = {
  DEFAULT_TEXT: 'Swipe to Begin Your Journey',
} as const;

// Eye Icons for Password Visibility
export const ICONS = {
  EYE_OPEN: '👁️',
  EYE_CLOSED: '👁️‍🗨️',
  HOME: '🏠',
  RESOURCES: '📚',
  JOURNAL: '📔',
  PROFILE: '👤',
  SETTINGS: '⚙️',
} as const;

// Home Screen
export const HOME = {
  // Welcome Section
  WELCOME_BACK: 'Welcome back,',
  USER_NAME: 'Sarah 👋',
  HEADER_SUBTITLE: 'Step by step, you\'re moving forward.',
  
  // Journey Overview
  JOURNEY_OVERVIEW_TITLE: 'Your Empowerment Journey',
  JOURNEY_OVERVIEW_SUBTITLE: 'Nothing here is rushed. Take your time.',
  CONTINUE_WHERE_LEFT_OFF: 'Continue Where I Left Off',
  
  // Progress Section
  OVERALL_PROGRESS: 'Overall Progress',
  PROGRESS_SUBTITLE: 'Step by step, you\'re moving forward.',
  
  // Journey Steps
  RESUME: 'Resume',
  ITEMS: 'Items',
  
  // Accessibility
  CONTINUE_JOURNEY: 'Continue your journey',
} as const;

// Resources Screen
export const RESOURCES = {
  TITLE: 'Support',
  SUBTITLE: 'Help and resources, whenever you need them.',
  CRISIS_HOTLINES: 'Crisis Hotlines (24/7)',
  BOOKS_ARTICLES: 'Books & Articles',
  WEBSITES_REFERRALS: 'Websites & Referrals',
  TEXT: 'Text',
  CALL: 'Call',
  OPEN_RESOURCE: 'Open Resource',
  VISIT_WEBSITE: 'Visit Website',
  BY: 'By',
} as const;

// Journal Screen
export const JOURNAL = {
  TITLE: 'My Journal',
  JOURNAL_ENTRIES: 'Journal Entries',
  QA_REFLECTIONS: 'Q&A Reflections',
  NO_ENTRIES_YET: 'No journal entries yet. Start writing to add one.',
  NO_REFLECTIONS_YET: 'No reflections yet. They\'ll appear here as you answer questions on your healing journey.',
  WRITE_THOUGHTS: 'Write your thoughts here... Use this space to reflect, release, and reconnect with yourself.',
  SAVE_ENTRY: 'Save Entry',
  PRIVACY_DISCLAIMER: 'Your journal is private. Only you can see what you write here.',
  FOCUS_OF_ADVICE: 'Focus of Advice',
  REFLECTION_QUESTIONS: 'Reflection Questions',
  YOUR_REFLECTION: 'Your Reflection',
  DOWNLOAD_PDF: 'Download PDF',
  DELETE_ENTRY: 'Delete Entry',
  EDIT: 'Edit',
  DELETE: 'Delete',
  DOWNLOAD: 'Download',
  PRIVACY_MESSAGE: 'This space is yours alone',
  PRIVACY_SUBTITLE: 'Saved securely, only visible to you',
} as const;

// Profile Screen
export const PROFILE = {
  EDIT_PROFILE: 'Edit Profile',
  CHANGE_PASSWORD: 'Change Password',
  LOGOUT: 'Logout',
  DELETE_ACCOUNT: 'Delete Account',
  DELETE_ACCOUNT_SUBTITLE: "Before deactivating, you'll be offered to export your journals.",
  PRIVACY_POLICY: 'Privacy Policy',
  TERMS_AND_CONDITION: 'Terms and condition',
  ALLOW_NOTIFICATIONS: 'Allow notifications',
  NOTIFICATIONS_SUBTITLE: "You're in control. Notification previews are hidden by default to protect your privacy.",
  ACCOUNT: 'Account',
  PRIVACY_DATA: 'Privacy & Data',
  CURRENT_PASSWORD: 'Current Password',
  NEW_PASSWORD: 'New Password',
  CONFIRM_NEW_PASSWORD: 'Confirm New Password',
  SAVE_NEW_PASSWORD: 'Save New Password',
  INCORRECT_CURRENT_PASSWORD: 'Incorrect current password',
  DELETE_ACCOUNT_WARNING: 'Deleting your account will permanently erase all journals, progress, and personal data. This cannot be undone. Consider exporting your journals first.',
  EXPORT_JOURNALS: 'Export Journals',
  CANCEL: 'Cancel',
  // User Info
  DEFAULT_USER_NAME: 'Sarah Johnson',
  DEFAULT_USER_EMAIL: 'sarah.johnson@email.com',
  // Alert Messages
  LOGOUT_TITLE: 'Logout',
  LOGOUT_MESSAGE: 'Are you sure you want to logout?',
  EXPORT_JOURNALS_TITLE: 'Export Journals',
  EXPORT_JOURNALS_MESSAGE: 'Journal export functionality will be implemented here.',
  ERROR_TITLE: 'Error',
  PRIVACY_POLICY_ERROR: 'Could not open privacy policy link.',
  TERMS_ERROR: 'Could not open terms and condition link.',
} as const;
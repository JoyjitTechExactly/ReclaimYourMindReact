export type AuthStackParamList = {
  Onboard: undefined;
  SignIn: undefined;
  SignUp: undefined;
  StartMyJourney: undefined;
  SignUpConfirmation: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  ResetPassword: { email: string };
  PasswordConfirmation: undefined;
};

export type AppStackParamList = {
  // Tab Navigator Screens
  Home: undefined;
  Resources: undefined;
  Journal: undefined;
  Profile: undefined;
  // Home Navigator Screens
  ActionIntro: undefined;
  TopicListing: { stepId: string; stepType: 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action'; categoryId?: string };
  TopicDetails: { topicId: string; stepId: string; stepType: 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action' };
  ExtraVideos: { topicId: string; stepId: string; stepType: 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action' };
  TopicCompletion: { topicId: string; stepId: string; stepType: 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action' };
  // Journal Navigator Screens
  NewJournalEntry: undefined;
  JournalEntryDetail: { entryId: string; editMode?: boolean };
  QAReflectionDetail: { reflectionId: string; editMode?: boolean };
  // Profile Navigator Screens
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type RootStackNavigationProp = any;

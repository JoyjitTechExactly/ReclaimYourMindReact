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
  Home: undefined;
  Resources: undefined;
  Journal: undefined;
  NewJournalEntry: undefined;
  JournalEntryDetail: { entryId: string; editMode?: boolean };
  QAReflectionDetail: { reflectionId: string; editMode?: boolean };
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type RootStackNavigationProp = any;

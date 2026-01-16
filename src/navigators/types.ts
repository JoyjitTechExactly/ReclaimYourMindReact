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
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type RootStackNavigationProp = any;

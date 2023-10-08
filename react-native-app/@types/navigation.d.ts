import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
};

export type ApplicationStackParamList = {
  Login: undefined;
  NoAccess: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  ScanQR: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

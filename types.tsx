/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  ChatRoom: {
    user: User
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Camera: undefined;
  Discussion: undefined;
  PBO: undefined;
  Ticket: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = MaterialTopTabScreenProps<
  RootTabParamList,
  Screen
>;

export type User = {
  id: string,
  profile?: string,
  name: String,
  lastSeen: Number
}

export type Message = {
  id: string,
  content: String,
  createdAt: Number,
  user?: User
}

export type Chat = {
  id: string;
  user: User;
  lastMessage: Message
};
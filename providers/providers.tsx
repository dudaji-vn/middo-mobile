import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NotificationProvider } from './notification-provider';
import { ReactQueryProviders } from './react-query-provider';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProviders>
      <SafeAreaProvider>{children}</SafeAreaProvider>
      <NotificationProvider />
      <StatusBar style="dark" />
    </ReactQueryProviders>
  );
};

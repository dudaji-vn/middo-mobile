import '../global.css';

import { Redirect, Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { VERSION } from '~/configs/env.config';
import { Providers } from '~/providers';

export default function RootLayout() {
  return (
    <Providers>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </Providers>
  );
}

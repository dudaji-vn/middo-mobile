import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MIDDO_WEB_URL } from '~/configs/env.config';

type AuthState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  isLogged: boolean;
};
type AuthActions = {
  storeTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: undefined,
      refreshToken: undefined,
      notifyToken: undefined,
      baseWebViewUrl: MIDDO_WEB_URL,
      isLogged: false,
      setAccessToken: (accessToken) => {
        set({ accessToken });
      },
      storeTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLogged: tokens.accessToken !== undefined && tokens.refreshToken !== undefined,
        });
      },
      logout: async () => {
        set({
          accessToken: undefined,
          refreshToken: undefined,
          isLogged: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['baseWebViewUrl', 'notifyToken'].includes(key))
        ),
    }
  )
);

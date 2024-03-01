import { NativeSyntheticEvent } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';

import { useAuthStore, useNotificationStore } from '~/features/auth/stores';
import { Tokens } from '~/types';
const CHECK_COOKIE: string = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;

export const useWebviewTokens = (webviewRef: React.RefObject<WebView>) => {
  const { storeTokens, logout } = useAuthStore((state) => ({
    storeTokens: state.storeTokens,
    logout: state.logout,
  }));
  const setCurrentRoomId = useNotificationStore((state) => state.setCurrentRoomId);

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    // Check cookies every time URL changes
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(CHECK_COOKIE);
    }
    if (navigationState.url.includes('sign-out')) {
      logout();
    }
    const roomId = extractRoomIdFormUrl(navigationState.url);
    setCurrentRoomId(roomId);
  };

  const onMessage = (event: NativeSyntheticEvent<WebViewMessage>) => {
    const { data } = event.nativeEvent;
    if (data.includes('Cookie:')) {
      const cookie = data.replace('Cookie: ', '').trim();
      const tokens = extractTokens(cookie);
      if (tokens) {
        storeTokens(tokens);
      }
    }
  };

  return { onNavigationStateChange, onMessage };
};

function extractTokens(tokenString: string): Tokens | null {
  const regex = /access_token=([^;]+);.*refresh_token=([^;]+)/;
  const match = tokenString.match(regex);
  if (match) {
    return {
      accessToken: match[1],
      refreshToken: match[2],
    };
  }
  return null;
}

function extractRoomIdFormUrl(url: string): string | null {
  const match = url.match(/talk\/([^?]+)/);
  if (match) {
    return match[1];
  }
  return null;
}

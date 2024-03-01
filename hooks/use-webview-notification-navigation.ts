import { useEffect } from 'react';
import WebView from 'react-native-webview';

import { SPK_NOTIFY, SPK_PLATFORM } from '~/configs/search-params.configs';
import { useNotificationStore } from '~/features/auth/stores';

export const useWebviewNotificationNavigation = (webviewRef: React.RefObject<WebView>) => {
  const { notifyToken, notification } = useNotificationStore((state) => ({
    notifyToken: state.notifyToken,
    notification: state.notification,
  }));
  const goToURL = (url: string) => {
    if (webviewRef.current) webviewRef.current.injectJavaScript(`window.location.href = '${url}';`);
  };

  const query = `${SPK_PLATFORM}=mobile&${notifyToken ? `${SPK_NOTIFY}=${notifyToken}` : ''}`;

  useEffect(() => {
    const url = notification?.request.content.data?.url;
    if (webviewRef.current && url) {
      const uri = `${url}?${query}`;
      goToURL(uri);
    }
  }, [webviewRef.current, notification, query]);
};

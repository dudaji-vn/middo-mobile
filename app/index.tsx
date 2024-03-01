import React from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

import { SafeAreaLayout } from '~/components';
import { MIDDO_WEB_URL } from '~/configs/env.config';
import { useWebviewGesture, useWebviewNotificationNavigation, useWebviewTokens } from '~/hooks';

export default function WebviewScreen() {
  const webviewRef = React.useRef<WebView>(null);

  const { onMessage, onNavigationStateChange } = useWebviewTokens(webviewRef);

  useWebviewGesture(webviewRef);
  useWebviewNotificationNavigation(webviewRef);

  return (
    <SafeAreaLayout>
      <WebView
        ref={webviewRef}
        className="flex-1"
        allowsBackForwardNavigationGestures
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        userAgent={
          Platform.OS === 'android'
            ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
            : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
        }
        source={{ uri: MIDDO_WEB_URL }}
      />
    </SafeAreaLayout>
  );
}

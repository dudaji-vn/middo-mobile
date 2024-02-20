import { Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';

import { SafeAreaLayout } from '~/components';
import NotificationManualButton from '~/components/notification-manual-button';
import { MIDDO_WEB_URL } from '~/configs/env.config';

export default function WebviewScreen() {
  return (
    <SafeAreaLayout>
      <WebView
        className="flex-1 pt-20"
        userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
        originWhitelist={['https://*', 'http://*', 'file://*', 'sms://*']}
        source={{ uri: MIDDO_WEB_URL }}
        style={{ paddingTop: 20 }}
      />
      <NotificationManualButton />
    </SafeAreaLayout>
  );
}

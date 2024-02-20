import * as Notifications from 'expo-notifications';
import { Button, Text, View } from 'react-native';

import { usePushNotifications } from '~/hooks/use-push-notification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationManualButton = () => {
  const { expoPushToken, notification } = usePushNotifications();
  return (
    <View>
      <Text>Your expo push token: {expoPushToken?.data}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text> */}
      </View>
      <Button onPress={schedulePushNotification} title="Nice Button" />
    </View>
  );
};

export default NotificationManualButton;

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

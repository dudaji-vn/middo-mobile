import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useNotificationStore } from '~/features/auth/stores';
import { useAuthStore } from '~/features/auth/stores/auth.store';
import { notificationApi } from '~/features/notifications/api';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  const isLogged = useAuthStore((state) => state.isLogged);
  const { setNotifyToken, setNotification, currentRoomId } = useNotificationStore((state) => {
    return {
      setNotifyToken: state.setNotifyToken,
      setNotification: state.setNotification,
      currentRoomId: state.currentRoomId,
    };
  });
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification');
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      alert('Must be using a physical device for Push notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }

  const handleSubscription = async (token: string | undefined) => {
    try {
      if (!token) return;
      const isSubscribed = await notificationApi.checkSubscription(token);
      if (!isSubscribed) {
        await notificationApi.subscribe(token);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token);
      await handleSubscription(token?.data);
      setNotifyToken(token?.data);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // const url = notification.request.content.data?.url;
      // if (url.includes(currentRoomId)) {
      //   Notifications.setNotificationHandler({
      //     handleNotification: async () => ({
      //       shouldPlaySound: false,
      //       shouldShowAlert: false,
      //       shouldSetBadge: false,
      //     }),
      //   });
      // } else {
      //   Notifications.setNotificationHandler({
      //     handleNotification: async () => ({
      //       shouldPlaySound: true,
      //       shouldShowAlert: true,
      //       shouldSetBadge: true,
      //     }),
      //   });
      // }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotification(response.notification);
    });

    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current!);
        Notifications.removeNotificationSubscription(responseListener.current!);
      }
    };
  }, [isLogged, currentRoomId]);

  return {
    expoPushToken,
  };
};

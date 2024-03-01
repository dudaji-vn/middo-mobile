import { PropsWithChildren } from 'react';

import { usePushNotifications } from '~/features/notifications/hooks';

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  usePushNotifications();
  return <></>;
};

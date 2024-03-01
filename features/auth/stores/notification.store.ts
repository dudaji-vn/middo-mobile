import { Notification } from 'expo-notifications';
import { create } from 'zustand';

type NotificationState = {
  notifyToken: string | null;
  notification: Notification | undefined;
  currentRoomId: string | null;
};

type NotificationActions = {
  setNotifyToken: (notifyToken: string | undefined) => void;
  setNotification: (notification: Notification) => void;
  setCurrentRoomId: (roomId: string | null) => void;
};

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifyToken: null,
  notification: undefined,
  setNotifyToken: (notifyToken) => {
    set({ notifyToken });
  },
  currentRoomId: null,
  setCurrentRoomId: (roomId) => {
    set({ currentRoomId: roomId });
  },
  setNotification: (notification) => {
    set({ notification });
  },
}));

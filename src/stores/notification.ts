import { defineStore } from 'pinia';

export type TNotificationStatus = 'success' | 'warning' | 'error' | 'default';

type NotificationPayload = {
  timeout?: number
  text: string
  btnRight?: {
    title: string
    onClick: () => void
  }
};

export interface INotification extends NotificationPayload {
  status: TNotificationStatus
  id: number
}

const defaultTimeout = 2000;

const createNotification = (payload: NotificationPayload, status: TNotificationStatus): INotification => ({
  ...payload,
  id: Math.random() * 1000,
  status,
});

export const useNotificationStore = defineStore('notification', {
  state: (): { notifications: INotification[] } => ({
    notifications: [],
  }),
  actions: {
    updateState(payload: NotificationPayload, status: TNotificationStatus) {

      const notification = createNotification(payload, status);

      this.notifications.push(notification);

      setTimeout(() => {
        this.notifications = this.notifications.filter((t) => t.id !== notification.id);
      }, payload.timeout ?? defaultTimeout);
    },

    notify(payload: NotificationPayload) {
      this.updateState(payload, 'default');
    },

    success(payload: NotificationPayload) {
      this.updateState(payload, 'success');
    },

    warning(payload: NotificationPayload) {
      this.updateState(payload, 'warning');
    },

    error(payload: NotificationPayload) {
      this.updateState(payload, 'error');
    },

    clearNotiById(notificationId) {
      this.notifications = this.notifications.filter((t) => t.id !== notificationId);
    },
  },
});

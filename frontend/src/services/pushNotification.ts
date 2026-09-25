import { apiClient } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushNotificationService = {
  async register(): Promise<{ success: boolean; message: string }> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Push notifications are not supported in this browser.' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Notification permission was denied.' };
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const res = await apiClient.getVapidPublicKey();
      const publicKey = res.data?.publicKey;

      if (!publicKey) {
        return { success: false, message: 'VAPID public key not found on server.' };
      }

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
        });
      }

      await apiClient.subscribePush(subscription, 'admin');

      return {
        success: true,
        message: 'Browser push notifications registered successfully!',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to enable push notifications.' };
    }
  },
};
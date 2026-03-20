import Swal from 'sweetalert2';
import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}
 
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}
 
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }
 
  if (isNotificationGranted()) {
    return true;
  }
 
  const status = await Notification.requestPermission();
 
  if (status === 'denied') {
    Swal.fire({
      icon: 'error',
      title: 'Izin Ditolak',
      text: 'Izin notifikasi ditolak oleh browser Anda.',
    });
    return false;
  }
 
  if (status === 'default') {
    Swal.fire({
      icon: 'warning',
      title: 'Izin Diabaikan',
      text: 'Izin notifikasi ditutup atau diabaikan.',
    });
    return false;
  }
 
  return true;
}
 
export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}
 
export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}
 
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }
 
  if (await isCurrentPushSubscriptionAvailable()) {
    Swal.fire({
      icon: 'info',
      title: 'Sudah Aktif',
      text: 'Anda sudah berlangganan push notification.',
    });
    return;
  }
 
  console.log('Mulai berlangganan push notification...');

  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
 
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error('subscribe: response:', response);
      Swal.fire({ icon: 'error', title: 'Gagal', text: failureSubscribeMessage });
 
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
 
      return;
    }
 
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: successSubscribeMessage,
      showConfirmButton: false,
      timer: 2000
    });
  } catch (error) {
    console.error('subscribe: error:', error);
    Swal.fire({ icon: 'error', title: 'Gagal', text: failureSubscribeMessage });
 
    // Undo subscribe to push notification
    await pushSubscription.unsubscribe();
  }

}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Tidak bisa memutus langganan karena Anda belum berlangganan sebelumnya.',
      });
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: failureUnsubscribeMessage });
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: failureUnsubscribeMessage });
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: successUnsubscribeMessage,
      showConfirmButton: false,
      timer: 2000
    });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: failureUnsubscribeMessage });
    console.error('unsubscribe: error:', error);
  }
}
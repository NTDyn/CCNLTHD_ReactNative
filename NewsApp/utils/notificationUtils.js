import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Quyền thông báo bị từ chối');
    }
  } else {
    alert('Chạy thử trên thiết bị thật nha!');
  }
}

export async function sendNewsNotification(title, url) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tin mới!',
      body: title,
      data: { url },
    },
    trigger: null,
  });
}

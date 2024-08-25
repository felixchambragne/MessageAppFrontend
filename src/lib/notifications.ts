import messaging from '@react-native-firebase/messaging';
import * as Keychain from 'react-native-keychain';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function storeNotificationsToken(notificationsToken: string) {
  await Keychain.setGenericPassword('notificationsToken', notificationsToken, {
    service: 'notificationsToken',
  });
}

export async function retrieveNotificationsToken() {
  const credentials = await Keychain.getGenericPassword({
    service: 'notificationsToken',
  });
  return credentials ? credentials.password : null;
}

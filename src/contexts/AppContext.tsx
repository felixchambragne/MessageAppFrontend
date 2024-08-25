import {useNetInfo} from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Socket} from 'socket.io-client';
import {
  requestUserPermission,
  retrieveNotificationsToken,
  storeNotificationsToken,
} from '../lib/notifications';

interface AppContextData {
  isInternetConnected: boolean;
  isServerConnected: boolean;
  socket?: Socket;
  setSocket: (socket: Socket) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

//export const API_URL = 'http://10.21.1.19:3000';
export const API_URL = 'http://10.100.1.188:3000';
//export const API_URL = 'http://192.168.137.1:3000';

axios.defaults.baseURL = API_URL;

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [socket, setSocket] = useState<Socket>();
  const {isConnected: isInternetConnected} = useNetInfo();
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('getNotificationsToken', async callback => {
      const storedToken = await retrieveNotificationsToken();
      if (storedToken) {
        callback(storedToken);
      } else {
        checkApplicationPermission();
        if (await requestUserPermission()) {
          messaging()
            .getToken()
            .then(notificationsToken => {
              storeNotificationsToken(notificationsToken);
              callback(notificationsToken);
            });
        }
      }
    });

    messaging().onTokenRefresh(notificationsToken => {
      storeNotificationsToken(notificationsToken);
      socket.emit('setNotificationsToken', notificationsToken);
    });

    socket.on('connect', () => setIsServerConnected(true));
    socket.on('disconnect', () => setIsServerConnected(false));
    socket.on('connect_error', () => setIsServerConnected(false));
    socket.on('reconnect', () => setIsServerConnected(true));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('reconnect');
    };
  }, [socket]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (!error.response || error.response.status >= 500) {
          setIsServerConnected(false);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isInternetConnected: isInternetConnected ?? true,
        isServerConnected,
        socket,
        setSocket,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

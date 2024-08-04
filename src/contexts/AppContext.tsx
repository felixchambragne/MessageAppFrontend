import {useNetInfo} from '@react-native-community/netinfo';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {createContext} from 'react';
import {Socket} from 'socket.io-client';

interface AppContextData {
  isInternetConnected: boolean | null;
  isServerConnected: boolean;
  socket?: Socket;
  setSocket: (socket: Socket) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const API_URL = 'http://10.21.1.30:3000';
//export const API_URL = 'http://10.100.0.152:3000';
//export const API_URL = 'http://192.168.137.1:3000';

axios.defaults.baseURL = API_URL;

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [socket, setSocket] = useState<Socket>();
  const {isConnected: isInternetConnected} = useNetInfo();
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('connect', () => setIsServerConnected(true));
    socket.on('disconnect', () => setIsServerConnected(false));
    socket.on('connect_error', () => setIsServerConnected(false));
    socket.on('reconnect', () => setIsServerConnected(true));

    // Cleanup on unmount
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
        isInternetConnected,
        isServerConnected,
        socket,
        setSocket,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

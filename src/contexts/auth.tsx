import React, {useEffect, useState} from 'react';
import {createContext} from 'react';
import {retrieveToken, storeToken} from '../api/auth/jwt';
import axios from 'axios';
import {auth} from '../api/auth/auth';
import {io, Socket} from 'socket.io-client';

interface AuthContextData {
  userId: string | null;
  signedIn: boolean;
  socket?: Socket;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

//export const API_URL = 'http://10.21.1.30:3000';
export const API_URL = 'http://10.100.0.152:3000';

axios.defaults.baseURL = API_URL;

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket>();

  //Retrieve token from storage
  useEffect(() => {
    const fetchData = async () => {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        const res = await auth();
        storeToken(res.token);
        setToken(res.token);
      } else {
        setToken(storedToken);
      }
    };
    fetchData();
  }, []);

  //Set token in headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setSocket(io(API_URL, {auth: {token}}));
    }
  }, [token]);

  //Retrieve user id
  useEffect(() => {
    if (socket) {
      socket.on('userId', (id: string) => {
        console.log('SETTING USER ID TO:', id);
        setUserId(id);
      });
    }
  }, [socket]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        signedIn: !!userId,
        socket,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

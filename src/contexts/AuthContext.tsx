import React, {useContext, useEffect, useState} from 'react';
import {createContext} from 'react';
import {retrieveToken, storeToken} from '../lib/jwt';
import axios from 'axios';
import {signUp} from '../api/auth/signUp';
import {io} from 'socket.io-client';
import AppContext, {API_URL} from './AppContext';

interface AuthContextData {
  userId: string | null;
  signedIn: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const {socket, setSocket} = useContext(AppContext);

  //Retrieve token from storage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        const res = await signUp();
        storeToken(res.token);
        setToken(res.token);
      } else {
        setToken(storedToken);
      }
    };
    getToken();
  }, []);

  //Set token in headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setSocket(io(API_URL, {auth: {token}}));
    }
  }, [setSocket, token]);

  //Retrieve user id
  useEffect(() => {
    if (socket) {
      socket.on('userId', (id: string) => {
        setUserId(id);
      });
    }
  }, [socket]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        signedIn: !!userId,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import React, {useContext, useEffect, useState} from 'react';
import {createContext} from 'react';
import {retrieveToken, storeToken} from '../api/auth/jwt';
import axios from 'axios';
import {auth} from '../api/auth/auth';
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

import axios from 'axios';
import {generateECDHKeys} from '../../lib/encryption';

export const signUp = async () => {
  const publicKey = await generateECDHKeys();
  if (!publicKey) {
    throw new Error('Error generating key pair');
  }

  const res = axios
    .post('/auth/signUp', {
      headers: {'Content-Type': 'application/json'},
      publicKey,
    })
    .then(async response => {
      return response.data;
    })
    .catch(error => {
      console.log('error', error);
      if (error.response) {
        throw new Error(error.response.status);
      }
    });

  return res;
};

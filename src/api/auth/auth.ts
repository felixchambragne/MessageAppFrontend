import axios from 'axios';
import {API_URL} from '../../contexts/auth';

export const auth = () => {
  const res = axios
    .post(`${API_URL}/auth`, {
      headers: {'Content-Type': 'application/json'},
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

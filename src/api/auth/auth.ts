import axios from 'axios';

export const auth = () => {
  const res = axios
    .post('/auth', {
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

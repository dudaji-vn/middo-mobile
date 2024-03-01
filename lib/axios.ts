import axios from 'axios';

import { useAuthStore } from '~/features/auth/stores/auth.store';

const baseURL = `${process.env.EXPO_PUBLIC_API_URL}/api`;
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
// add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.message === 'Invalid token specified') {
      useAuthStore.getState().logout();
      return Promise.reject(error.response.data);
    }
    switch (error.response.status) {
      case 401:
        if (error.response.data.message === 'Invalid token specified') {
          useAuthStore.getState().logout();
        }

        break;
      case 403:
        break;
      default:
        break;
    }

    return Promise.reject(error.response.data);
  }
);

axiosClient.interceptors.request.use(
  async (config) => {
    let accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      // const decodeToken = jwtDecode(accessToken);
      // console.log('decodeToken', decodeToken);
      // const today = new Date();
      // if (decodeToken.exp && decodeToken?.exp < today.getTime() / 1000) {
      //   try {
      //     const res = await axios.get(`${baseURL}/auth/refresh_token`, {
      //       withCredentials: true,
      //     });
      //     accessToken = res.data.access_token;
      //     if (accessToken) useAuthStore.getState().setAccessToken(accessToken);
      //   } catch (error: any) {
      //     return Promise.reject(error.response.data);
      //   }
      // }
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log('error', error.response.data);
    return Promise.reject(error.response.data);
  }
);

export { axiosClient as axios };

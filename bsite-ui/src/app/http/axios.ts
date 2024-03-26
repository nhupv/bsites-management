import axios from "axios";
import type { AxiosInstance } from "axios";
import appConfigs from "@/app/appConfigurations";
import {LS_KEY_TOKEN} from "@/app/const";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: appConfigs.baseUrl,
  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem(LS_KEY_TOKEN)}`,
  //   // Authorization: options.token ? `Bearer ${options.token}` : "",
  // },
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem(LS_KEY_TOKEN)
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

axiosInstance.interceptors.response.use((response) => response, error => {
  if(error.response && error.response.status === 401 && !window.location.href.includes('/signin')) {
    localStorage.removeItem(LS_KEY_TOKEN)
    window.location.href = '/signin'
  }
  return Promise.reject(error)
})

export default axiosInstance;

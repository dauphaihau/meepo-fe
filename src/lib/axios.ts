import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { logger } from "@/core/helper";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  validateStatus: (status) => {
    return status >= 200 && status < 500
  }
});

const onRequest = (configReq: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const { method, url } = configReq;
  const auth_token = localStorage.getItem("auth_token");
  if (auth_token) {
    configReq.headers.Authorization = auth_token;
  }
  logger.debug(`🚀 src/lib/axios.ts [API] ${method?.toUpperCase()} ${url} | Request`, configReq.data, 'src/lib/axios.ts');
  if (method === "get") {
    configReq.timeout = 15000;
  }
  return configReq;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  logger.debug(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`, response, 'src/lib/axios.ts');
  return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  const { message } = error;
  const { method, url } = error.config as AxiosRequestConfig;
  const { status } = error.response as AxiosResponse ?? {};
  logger.error(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`, 'src/lib/axios.ts');
  return Promise.reject(error);
}

axiosInstance.interceptors.request.use(onRequest, onResponseError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export const apiHelper = axiosInstance

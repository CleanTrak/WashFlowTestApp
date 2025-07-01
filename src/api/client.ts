import axios from "axios";
import type { AxiosInstance } from "axios";
import type { WashQueueCarRequest, TransactionReportParams } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000`;

const API_CLOUD_URL =
  import.meta.env.VITE_API_CLOUD_URL || "https://api.cleantrak.com";
axios.defaults.withCredentials = true;

const MOXA: AxiosInstance = axios.create({
  baseURL: API_BASE_URL + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const CLOUD: AxiosInstance = axios.create({
  baseURL: API_CLOUD_URL + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const cloudCustomHeaders: Record<string, string> = {};
export const setCloudHeaders = (
  companyId: string,
  tunnelId: string,
  accessToken?: string
) => {
  cloudCustomHeaders["X-Company-UUID"] = companyId;
  cloudCustomHeaders["X-Tunnel-UUID"] = tunnelId;
  if (accessToken) {
    cloudCustomHeaders["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete cloudCustomHeaders["Authorization"];
  }
};

CLOUD.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  Object.assign(config.headers, cloudCustomHeaders);
  return config;
});

export const washQueueAPI = {
  addCar: (carData: WashQueueCarRequest) => {
    return MOXA.post("/washQueue/car", carData);
  },
  getTransactionReport: (params: TransactionReportParams) => {
    return MOXA.get("/reports/transaction", { params });
  },
};

// Statistics API functions
export const getAvgWashTime = async (
  companyID: string,
  tunnelID: string
): Promise<{ average_wash_time_seconds: number }> => {
  const response = await CLOUD.get("/stat/getAvgWashTime/", {
    headers: {
      "X-Company-UUID": companyID,
      "X-Tunnel-UUID": tunnelID,
    },
  });
  return response.data;
};

export const getCarsPerHour = async (
  companyID: string,
  tunnelID: string
): Promise<{ cars_count: number }> => {
  const response = await CLOUD.get("/stat/getCarsPerHour/", {
    headers: {
      "X-Company-UUID": companyID,
      "X-Tunnel-UUID": tunnelID,
    },
  });
  return response.data;
};

export const getTotalWashedCarsToday = async (
  companyID: string,
  tunnelID: string
): Promise<{ total_cars: number }> => {
  const response = await CLOUD.get("/stat/getTotalWashedCarsToday/", {
    headers: {
      "X-Company-UUID": companyID,
      "X-Tunnel-UUID": tunnelID,
    },
  });
  return response.data;
};

export const getHeartBeat = async (deviceId: string): Promise<unknown> => {
  const response = await CLOUD.get(`/heartBeat/`, {
    headers: {
      "X-Device-UUID": deviceId,
    },
  });
  return response.data;
};

export { MOXA, CLOUD };

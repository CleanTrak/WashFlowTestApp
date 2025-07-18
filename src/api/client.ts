import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  WashQueueCarRequest,
  TransactionReportParams,
  QueueCarsResponse,
  MomentaryRequest,
} from "../types";

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
let apiToken: string = "";

export const setCloudHeaders = (
  companyId: string,
  tunnelId: string,
  apiTokenValue: string
) => {
  cloudCustomHeaders["X-Company-UUID"] = companyId;
  cloudCustomHeaders["X-Tunnel-UUID"] = tunnelId;
  cloudCustomHeaders["Authorization"] = `Bearer ${apiTokenValue}`;

  // Store API token for both MOXA and CLOUD requests
  apiToken = apiTokenValue;
};

export const clearApiToken = () => {
  apiToken = "";
  delete cloudCustomHeaders["Authorization"];
  delete cloudCustomHeaders["X-Company-UUID"];
  delete cloudCustomHeaders["X-Tunnel-UUID"];
};

// Validate MoxaCore API Token
export const validateMoxaCoreToken = async (
  token: string
): Promise<boolean> => {
  try {
    const response = await MOXA.get("/system/token/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.valid === true;
  } catch (error) {
    console.error("MoxaCore token validation failed:", error);
    return false;
  }
};

CLOUD.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  Object.assign(config.headers, cloudCustomHeaders);
  return config;
});

// Add interceptor for MOXA requests to include MoxaCore token
MOXA.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (apiToken) {
    config.headers["Authorization"] = `Bearer ${apiToken}`;
  }
  return config;
});

export const momentaryAPI = {
  sendMomentary: (data: MomentaryRequest) => {
    return MOXA.post("/momentary", data);
  },
};

export const washQueueAPI = {
  addCar: (carData: WashQueueCarRequest) => {
    return MOXA.post("/washQueue/car", carData);
  },
  getCars: (state?: string): Promise<QueueCarsResponse> => {
    const params = state ? { state } : {};
    return MOXA.get("/washQueue/cars", { params }).then((res) => res.data);
  },
  updateCar: (invoiceId: string, carData: Partial<WashQueueCarRequest>) => {
    return MOXA.put(`/washQueue/car/${invoiceId}`, carData);
  },
  deleteCar: (invoiceId: string) => {
    return MOXA.delete(`/washQueue/car/${invoiceId}`);
  },
  getTransactionReport: (
    params: TransactionReportParams,
    companyID: string,
    tunnelID: string
  ) => {
    return CLOUD.get("/reports/transaction", {
      params,
      headers: {
        "X-Company-UUID": companyID,
        "X-Tunnel-UUID": tunnelID,
      },
    });
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

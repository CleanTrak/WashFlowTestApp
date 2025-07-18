import { useState, useEffect } from "react";
import {
  setCloudHeaders,
  validateMoxaCoreToken,
  CLOUD,
  clearApiToken,
} from "../api/client";
import type {
  AuthenticatedUserResponse,
  CompanyResponse,
  DeviceArrayResponse,
} from "../types/api";

export interface Credentials {
  apiToken: string;
}

export interface AuthData {
  companyId: string;
  tunnelId: string;
  deviceId: string;
}

const STORAGE_KEYS = {
  CREDENTIALS: "washflow-credentials",
  AUTH_DATA: "washflow-auth-data",
  IS_CONFIGURED: "washflow-is-configured",
} as const;

// Helper functions for localStorage
const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

const defaultCredentials: Credentials = {
  apiToken: "",
};

const defaultAuthData: AuthData = {
  companyId: "",
  tunnelId: "",
  deviceId: "",
};

export const useCredentials = () => {
  const [credentials, setCredentials] =
    useState<Credentials>(defaultCredentials);
  const [authData, setAuthData] = useState<AuthData>(defaultAuthData);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedCredentials = loadFromStorage(
      STORAGE_KEYS.CREDENTIALS,
      defaultCredentials
    );
    const savedAuthData = loadFromStorage(
      STORAGE_KEYS.AUTH_DATA,
      defaultAuthData
    );
    const savedIsConfigured = loadFromStorage(
      STORAGE_KEYS.IS_CONFIGURED,
      false
    );

    setCredentials(savedCredentials);
    setAuthData(savedAuthData);
    setIsConfigured(savedIsConfigured);

    // If previously configured, restore API headers
    if (
      savedIsConfigured &&
      savedCredentials.apiToken &&
      savedAuthData.companyId
    ) {
      setCloudHeaders(
        savedAuthData.companyId,
        savedAuthData.tunnelId,
        savedCredentials.apiToken
      );
    }
  }, []);

  const updateCredential = (key: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
    // Clear validation error when user updates credentials
    if (validationError) {
      setValidationError("");
    }
    // Clear configured state when credentials change after validation
    if (isConfigured) {
      setIsConfigured(false);
      saveToStorage(STORAGE_KEYS.IS_CONFIGURED, false);
      // Clear API token from client to prevent using old token
      clearApiToken();
    }
  };

  const applyCredentials = async () => {
    setIsValidating(true);
    setValidationError("");
    // Clear old API token before validation
    clearApiToken();

    try {
      // Step 1: Validate MoxaCore token
      const isTokenValid = await validateMoxaCoreToken(credentials.apiToken);

      if (!isTokenValid) {
        setValidationError("API Token is incorrect");
        return;
      }

      // Step 2: Get authenticated user info
      const userResponse = await CLOUD.get("/authenticatedUser/", {
        headers: {
          Authorization: `Bearer ${credentials.apiToken}`,
        },
      });
      const userData = userResponse.data as AuthenticatedUserResponse;

      if (!userData.company || userData.company.length === 0) {
        setValidationError("No company found for this user");
        return;
      }

      const companyId = userData.company[0];

      // Step 3: Get company info
      const companyResponse = await CLOUD.get(`/companies/${companyId}/`, {
        headers: {
          Authorization: `Bearer ${credentials.apiToken}`,
        },
      });
      const companyData = companyResponse.data as CompanyResponse;

      if (!companyData.tunnels || companyData.tunnels.length === 0) {
        setValidationError("No tunnels found for this company");
        return;
      }

      const tunnelId = companyData.tunnels[0];

      // Step 4: Get device info
      const devicesResponse = await CLOUD.get("/devices/", {
        headers: {
          Authorization: `Bearer ${credentials.apiToken}`,
          "X-Company-UUID": companyId,
          "X-Tunnel-UUID": tunnelId,
        },
      });
      const devicesData = devicesResponse.data as DeviceArrayResponse;

      console.log("devicesResponse", devicesResponse);

      if (!devicesData[0].id || devicesData.length === 0) {
        setValidationError("No devices found");
        return;
      }

      const deviceId = devicesData[0].id;

      // Step 5: Save all data and configure
      const newAuthData: AuthData = {
        companyId,
        tunnelId,
        deviceId,
      };

      setAuthData(newAuthData);

      // Set cloud headers for API calls
      setCloudHeaders(
        companyId,
        tunnelId,
        credentials.apiToken
      );

      // Save to localStorage
      saveToStorage(STORAGE_KEYS.CREDENTIALS, credentials);
      saveToStorage(STORAGE_KEYS.AUTH_DATA, newAuthData);
      saveToStorage(STORAGE_KEYS.IS_CONFIGURED, true);

      setIsConfigured(true);
    } catch (error: unknown) {
      console.error("Authentication failed:", error);
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 401) {
        setValidationError("API Token is invalid or expired");
      } else if (axiosError.response?.status === 403) {
        setValidationError("Access denied with this API Token");
      } else {
        setValidationError(
          "Failed to authenticate. Please check your API Token and try again."
        );
        console.log("error", error);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const clearCredentials = () => {
    setCredentials(defaultCredentials);
    setAuthData(defaultAuthData);
    setIsConfigured(false);
    setValidationError("");
    // Clear API token from client
    clearApiToken();
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_DATA);
    localStorage.removeItem(STORAGE_KEYS.IS_CONFIGURED);
  };

  const isValid = () => {
    return Boolean(credentials.apiToken?.trim());
  };

  return {
    credentials,
    authData,
    updateCredential,
    applyCredentials,
    clearCredentials,
    isConfigured,
    isValid: isValid(),
    isValidating,
    validationError,
  };
};

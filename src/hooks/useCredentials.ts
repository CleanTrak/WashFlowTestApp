import { useState, useEffect } from "react";
import { setCloudHeaders, validateMoxaCoreToken } from "../api/client";

export interface Credentials {
  cloudAccessToken: string; // renamed from accessToken
  moxaCoreToken: string; // new field
  tunnelId: string;
  companyId: string;
  deviceId: string;
}

const STORAGE_KEYS = {
  CREDENTIALS: "washflow-credentials",
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
  cloudAccessToken: "",
  moxaCoreToken: "",
  tunnelId: "",
  companyId: "",
  deviceId: "",
};

export const useCredentials = () => {
  const [credentials, setCredentials] =
    useState<Credentials>(defaultCredentials);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedCredentials = loadFromStorage(
      STORAGE_KEYS.CREDENTIALS,
      defaultCredentials
    );
    const savedIsConfigured = loadFromStorage(
      STORAGE_KEYS.IS_CONFIGURED,
      false
    );

    setCredentials(savedCredentials);
    setIsConfigured(savedIsConfigured);

    // If previously configured, restore API headers
    if (savedIsConfigured && savedCredentials.moxaCoreToken) {
      setCloudHeaders(
        savedCredentials.companyId,
        savedCredentials.tunnelId,
        savedCredentials.cloudAccessToken,
        savedCredentials.moxaCoreToken
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
    }
  };

  const applyCredentials = async () => {
    setIsValidating(true);
    setValidationError("");

    try {
      // Validate MoxaCore token first
      const isTokenValid = await validateMoxaCoreToken(
        credentials.moxaCoreToken
      );

      if (isTokenValid) {
        // Set cloud headers for API calls
        setCloudHeaders(
          credentials.companyId,
          credentials.tunnelId,
          credentials.cloudAccessToken,
          credentials.moxaCoreToken
        );

        // Save to localStorage only after successful validation
        saveToStorage(STORAGE_KEYS.CREDENTIALS, credentials);
        saveToStorage(STORAGE_KEYS.IS_CONFIGURED, true);

        setIsConfigured(true);
      } else {
        setValidationError("MoxaCore API Token is incorrect");
        // Don't save invalid credentials
      }
    } catch {
      setValidationError("Failed to validate MoxaCore API Token");
      // Don't save credentials if validation failed
    } finally {
      setIsValidating(false);
    }
  };

  const clearCredentials = () => {
    setCredentials(defaultCredentials);
    setIsConfigured(false);
    setValidationError("");
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.IS_CONFIGURED);
  };

  const isValid = () => {
    return Boolean(
      credentials.cloudAccessToken.trim() &&
        credentials.moxaCoreToken.trim() &&
        credentials.tunnelId.trim() &&
        credentials.companyId.trim()
    );
  };

  return {
    credentials,
    updateCredential,
    applyCredentials,
    clearCredentials,
    isConfigured,
    isValid: isValid(),
    isValidating,
    validationError,
  };
};

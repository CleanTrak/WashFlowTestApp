import { useState } from "react";
import { setCloudHeaders } from "../api/client";

export interface Credentials {
  accessToken: string;
  tunnelId: string;
  companyId: string;
  deviceId: string;
}

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    accessToken: "",
    tunnelId: "",
    companyId: "",
    deviceId: "",
  });
  const [isConfigured, setIsConfigured] = useState(false);

  const updateCredential = (key: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  };

  const applyCredentials = () => {
    setCloudHeaders(
      credentials.companyId,
      credentials.tunnelId,
      credentials.accessToken
    );
    setIsConfigured(true);
  };

  const isValid = () => {
    return Boolean(
      credentials.accessToken.trim() &&
        credentials.tunnelId.trim() &&
        credentials.companyId.trim()
    );
  };

  return {
    credentials,
    updateCredential,
    applyCredentials,
    isConfigured,
    isValid: isValid(),
  };
};

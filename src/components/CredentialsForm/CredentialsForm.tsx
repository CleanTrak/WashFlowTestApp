import React from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import type { Credentials } from "../../hooks/useCredentials";

interface CredentialsFormProps {
  credentials: Credentials;
  onUpdateCredential: (key: keyof Credentials, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export const CredentialsForm: React.FC<CredentialsFormProps> = ({
  credentials,
  onUpdateCredential,
  onSubmit,
  isValid,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
            Enter Credentials
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access token
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                value={credentials.accessToken}
                onChange={(e) =>
                  onUpdateCredential("accessToken", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tunnel ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                value={credentials.tunnelId}
                onChange={(e) => onUpdateCredential("tunnelId", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                value={credentials.companyId}
                onChange={(e) =>
                  onUpdateCredential("companyId", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device ID (for Heartbeat)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                value={credentials.deviceId}
                onChange={(e) => onUpdateCredential("deviceId", e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" disabled={!isValid}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

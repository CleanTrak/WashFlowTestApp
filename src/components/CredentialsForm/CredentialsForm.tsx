import React from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import type { Credentials } from "../../hooks/useCredentials";

interface CredentialsFormProps {
  credentials: Credentials;
  onUpdateCredential: (key: keyof Credentials, value: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  isValid: boolean;
  isValidating?: boolean;
  validationError?: string;
}

export const CredentialsForm: React.FC<CredentialsFormProps> = ({
  credentials,
  onUpdateCredential,
  onSubmit,
  onClear,
  isValid,
  isValidating = false,
  validationError = "",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleClear = () => {
    if (
      onClear &&
      confirm("Are you sure you want to clear all saved credentials?")
    ) {
      onClear();
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">
            Enter Credentials
          </h2>
          {onClear && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-red-600 underline transition-colors"
              disabled={isValidating}
            >
              Clear Saved Data
            </button>
          )}
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {validationError}
            </div>
          </div>
        )}

        {/* Token Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Cloud Access Token
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              placeholder="Enter your cloud access token"
              value={credentials.cloudAccessToken}
              onChange={(e) =>
                onUpdateCredential("cloudAccessToken", e.target.value)
              }
              disabled={isValidating}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              MoxaCore API Token
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              placeholder="Enter your MoxaCore API token"
              value={credentials.moxaCoreToken}
              onChange={(e) =>
                onUpdateCredential("moxaCoreToken", e.target.value)
              }
              disabled={isValidating}
              required
            />
          </div>
        </div>

        {/* ID Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Company ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              placeholder="Enter company ID"
              value={credentials.companyId}
              onChange={(e) => onUpdateCredential("companyId", e.target.value)}
              disabled={isValidating}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tunnel ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              placeholder="Enter tunnel ID"
              value={credentials.tunnelId}
              onChange={(e) => onUpdateCredential("tunnelId", e.target.value)}
              disabled={isValidating}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Device ID
              <span className="text-gray-400 text-xs">(for Heartbeat)</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              placeholder="Enter device ID"
              value={credentials.deviceId}
              onChange={(e) => onUpdateCredential("deviceId", e.target.value)}
              disabled={isValidating}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="px-12 py-3 text-lg font-semibold"
            disabled={!isValid || isValidating}
          >
            {isValidating ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Validating...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

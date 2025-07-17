import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card, JsonViewer } from "../ui/Card";

interface HeartbeatSectionProps {
  onGetHeartbeat: () => void;
  isLoading: boolean;
  response?: string | object;
  error?: Error | null;
  onGetLocalHeartbeat: () => void;
  isLoadingLocal: boolean;
  localResponse?: string | object;
  localError?: Error | null;
  deviceId: string;
}

export const HeartbeatSection: React.FC<HeartbeatSectionProps> = ({
  onGetHeartbeat,
  isLoading,
  response,
  error,
  onGetLocalHeartbeat,
  isLoadingLocal,
  localResponse,
  localError,
  deviceId,
}) => {
  const [activeTab, setActiveTab] = useState<"cloud" | "local">("cloud");
  const cloudDisabled = !deviceId.trim();

  return (
    <Card title="Heartbeat">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "cloud"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("cloud")}
          >
            Cloud Heartbeat
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "local"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("local")}
          >
            Local Heartbeat
          </button>
        </div>
      </div>

      {activeTab === "cloud" && (
        <div className="space-y-4">
          <div>
            <Button
              onClick={onGetHeartbeat}
              isLoading={isLoading}
              loadingText="Getting heartbeat..."
              disabled={cloudDisabled}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
            >
              Get cloud heartbeat
            </Button>
          </div>

          {cloudDisabled && (
            <div className="text-sm text-red-600">
              Please enter Device ID to get cloud heartbeat
            </div>
          )}

          {response && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Response:</h4>
              <JsonViewer data={response} />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm">
              <strong>Error:</strong> {error.message}
            </div>
          )}
        </div>
      )}

      {activeTab === "local" && (
        <div className="space-y-4">
          <div>
            <Button
              onClick={onGetLocalHeartbeat}
              isLoading={isLoadingLocal}
              loadingText="Getting heartbeat..."
              className="bg-orange-600 hover:bg-orange-700"
            >
              Get local heartbeat
            </Button>
          </div>

          {localResponse && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Response:</h4>
              <JsonViewer data={localResponse} />
            </div>
          )}

          {localError && (
            <div className="text-red-600 text-sm">
              <strong>Error:</strong> {localError.message}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

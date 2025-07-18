import React from "react";
import { Button } from "../ui/Button";
import { Card, JsonViewer } from "../ui/Card";

interface HeartbeatSectionProps {
  onGetHeartbeat: () => void;
  isLoading: boolean;
  response?: string | object;
  error?: Error | null;
  deviceId: string;
}

export const HeartbeatSection: React.FC<HeartbeatSectionProps> = ({
  onGetHeartbeat,
  isLoading,
  response,
  error,
  deviceId,
}) => {
  const disabled = !deviceId.trim();

  return (
    <Card title="Heartbeat">
      <div className="space-y-4">
        <div>
          <Button
            onClick={onGetHeartbeat}
            isLoading={isLoading}
            loadingText="Getting heartbeat..."
            disabled={disabled}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
          >
            Get heartbeat
          </Button>
        </div>

        {disabled && (
          <div className="text-sm text-red-600">
            Please enter Device ID to get heartbeat
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
    </Card>
  );
};

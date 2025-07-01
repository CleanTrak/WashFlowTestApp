import React from "react";
import { ApiSection } from "./ApiSection";

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
}) => (
  <ApiSection
    title="Heartbeat"
    buttonText="Get heartbeat"
    buttonColor="bg-yellow-600 hover:bg-yellow-700"
    onAction={onGetHeartbeat}
    isLoading={isLoading}
    loadingText="Getting heartbeat..."
    response={response}
    error={error}
    disabled={!deviceId.trim()}
    disabledReason={
      !deviceId.trim() ? "Please enter Device ID to get heartbeat" : undefined
    }
  />
);

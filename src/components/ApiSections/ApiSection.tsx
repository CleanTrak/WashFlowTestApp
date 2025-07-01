import React from "react";
import { Button } from "../ui/Button";
import { Card, JsonViewer } from "../ui/Card";

interface ApiSectionProps {
  title: string;
  buttonText: string;
  buttonColor?: string;
  onAction: () => void;
  isLoading: boolean;
  loadingText: string;
  response?: string | object;
  error?: Error | null;
  disabled?: boolean;
  disabledReason?: string;
}

export const ApiSection: React.FC<ApiSectionProps> = ({
  title,
  buttonText,
  buttonColor = "bg-blue-600 hover:bg-blue-700",
  onAction,
  isLoading,
  loadingText,
  response,
  error,
  disabled = false,
  disabledReason,
}) => {
  return (
    <Card title={title}>
      <Button
        onClick={onAction}
        isLoading={isLoading}
        loadingText={loadingText}
        className={buttonColor}
        disabled={disabled}
        title={disabledReason}
      >
        {buttonText}
      </Button>
      {response && <JsonViewer data={response} className="mt-4" />}
      {error && (
        <div className="mt-2 text-red-600 text-sm">{error.message}</div>
      )}
    </Card>
  );
};

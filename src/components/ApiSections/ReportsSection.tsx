import React from "react";
import { ApiSection } from "./ApiSection";

interface ReportsSectionProps {
  onGetReports: () => void;
  isLoading: boolean;
  response?: string | object;
  error?: Error | null;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  onGetReports,
  isLoading,
  response,
  error,
}) => (
  <ApiSection
    title="Reports"
    buttonText="Get reports"
    buttonColor="bg-gray-600 hover:bg-gray-700"
    onAction={onGetReports}
    isLoading={isLoading}
    loadingText="Loading reports..."
    response={response}
    error={error}
  />
);

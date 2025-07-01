import React from "react";
import { ApiSection } from "./ApiSection";

interface StatisticsSectionProps {
  onGetStatistics: () => void;
  isLoading: boolean;
  response?: string | object;
  error?: Error | null;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  onGetStatistics,
  isLoading,
  response,
  error,
}) => (
  <ApiSection
    title="Statistics"
    buttonText="Get statistics"
    buttonColor="bg-green-600 hover:bg-green-700"
    onAction={onGetStatistics}
    isLoading={isLoading}
    loadingText="Loading statistics..."
    response={response}
    error={error}
  />
);

import { useState } from "react";
import { formatISO, startOfDay, endOfDay } from "date-fns";
import {
  washQueueAPI,
  getAvgWashTime,
  getCarsPerHour,
  getTotalWashedCarsToday,
  getHeartBeat,
} from "../api/client";
import { useApi } from "./useApi";
import type { WashQueueCarRequest } from "../types";

interface ApiResponse {
  addCar?: string | object;
  statistics?: string | object;
  heartBeat?: string | object;
  reports?: string | object;
}

export const useApiOperations = (
  companyId: string,
  tunnelId: string,
  deviceId: string
) => {
  const [response, setResponse] = useState<ApiResponse>({});
  const [error, setError] = useState<string>("");

  const {
    execute: executeAddCar,
    isLoading: isAddingCar,
    error: addCarError,
  } = useApi((carData: unknown) =>
    washQueueAPI.addCar(carData as WashQueueCarRequest)
  );

  const {
    execute: executeGetStatistics,
    isLoading: isLoadingStats,
    error: statsError,
  } = useApi(async () => {
    const [avg, perHour, total] = await Promise.all([
      getAvgWashTime(companyId, tunnelId),
      getCarsPerHour(companyId, tunnelId),
      getTotalWashedCarsToday(companyId, tunnelId),
    ]);
    return { avg, perHour, total };
  });

  const {
    execute: executeGetHeartbeat,
    isLoading: isLoadingHeartbeat,
    error: heartbeatError,
  } = useApi(() => getHeartBeat(deviceId));

  const {
    execute: executeGetReports,
    isLoading: isLoadingReports,
    error: reportsError,
  } = useApi(() => {
    const now = new Date();
    return washQueueAPI.getTransactionReport({
      start_datetime: formatISO(startOfDay(now)),
      end_datetime: formatISO(endOfDay(now)),
    });
  });

  const handleAddCar = async (carData: WashQueueCarRequest) => {
    try {
      const result = await executeAddCar(carData);
      setResponse((prev) => ({ ...prev, addCar: result as string | object }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGetStatistics = async () => {
    try {
      const result = await executeGetStatistics();
      setResponse((prev) => ({
        ...prev,
        statistics: result as string | object,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGetHeartBeat = async () => {
    try {
      const result = await executeGetHeartbeat();
      setResponse((prev) => ({
        ...prev,
        heartBeat: result as string | object,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGetReports = async () => {
    try {
      const result = await executeGetReports();
      setResponse((prev) => ({ ...prev, reports: result as string | object }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
    response,
    error,
    setError,
    // Add Car
    handleAddCar,
    isAddingCar,
    addCarError,
    // Statistics
    handleGetStatistics,
    isLoadingStats,
    statsError,
    // Heartbeat
    handleGetHeartBeat,
    isLoadingHeartbeat,
    heartbeatError,
    // Reports
    handleGetReports,
    isLoadingReports,
    reportsError,
  };
};

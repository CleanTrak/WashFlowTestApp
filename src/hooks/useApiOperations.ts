import { useState } from "react";
import { startOfDay, endOfDay } from "date-fns";
import {
  washQueueAPI,
  momentaryAPI,
  getAvgWashTime,
  getCarsPerHour,
  getTotalWashedCarsToday,
  getHeartBeat,
  getLocalHeartBeat,
} from "../api/client";
import { useApi } from "./useApi";
import type {
  WashQueueCarRequest,
  QueueCarsResponse,
  MomentaryRequest,
  TransactionReportParams,
} from "../types";

interface ApiResponse {
  addCar?: string | object;
  statistics?: string | object;
  heartBeat?: string | object;
  localHeartBeat?: string | object;
  reports?: string | object;
  queueCars?: QueueCarsResponse;
  momentary?: string | object;
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
    execute: executeGetQueueCars,
    isLoading: isLoadingQueueCars,
    error: queueCarsError,
  } = useApi(() => washQueueAPI.getCars("IN_QUEUE"));

  const {
    execute: executeUpdateCar,
    isLoading: isUpdatingCar,
    error: updateCarError,
  } = useApi((params: unknown) => {
    const { invoiceId, carData } = params as {
      invoiceId: string;
      carData: Partial<WashQueueCarRequest>;
    };
    return washQueueAPI.updateCar(invoiceId, carData);
  });

  const {
    execute: executeDeleteCar,
    isLoading: isDeletingCar,
    error: deleteCarError,
  } = useApi((invoiceId: unknown) =>
    washQueueAPI.deleteCar(invoiceId as string)
  );

  const {
    execute: executeMomentary,
    isLoading: isSendingMomentary,
    error: momentaryError,
  } = useApi((data: unknown) =>
    momentaryAPI.sendMomentary(data as MomentaryRequest)
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
    execute: executeGetLocalHeartbeat,
    isLoading: isLoadingLocalHeartbeat,
    error: localHeartbeatError,
  } = useApi(() => getLocalHeartBeat());

  const {
    execute: executeGetReports,
    isLoading: isLoadingReports,
    error: reportsError,
  } = useApi((params: unknown) => {
    const reportParams = params as TransactionReportParams;
    return washQueueAPI.getTransactionReport(reportParams, companyId, tunnelId);
  });

  const handleAddCar = async (carData: WashQueueCarRequest) => {
    try {
      const result = await executeAddCar(carData);
      setResponse((prev) => ({ ...prev, addCar: result as string | object }));
      // Removed automatic queue refresh - user can manually refresh if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGetQueueCars = async () => {
    try {
      const result = await executeGetQueueCars();
      setResponse((prev) => ({
        ...prev,
        queueCars: result as QueueCarsResponse,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleUpdateCar = async (
    invoiceId: string,
    carData: Partial<WashQueueCarRequest>
  ) => {
    try {
      await executeUpdateCar({ invoiceId, carData });
      // Removed automatic queue refresh - user can manually refresh if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteCar = async (invoiceId: string) => {
    try {
      await executeDeleteCar(invoiceId);
      // Removed automatic queue refresh - user can manually refresh if needed
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

  const handleGetLocalHeartBeat = async () => {
    try {
      const result = await executeGetLocalHeartbeat();
      setResponse((prev) => ({
        ...prev,
        localHeartBeat: result as string | object,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleGetReports = async (params?: TransactionReportParams) => {
    try {
      const defaultParams: TransactionReportParams = {
        page: 1,
        pageSize: 10,
        period: "hourly",
        start_datetime: startOfDay(new Date()).toISOString(),
        end_datetime: endOfDay(new Date()).toISOString(),
        timefilter_start: "0000",
        timefilter_end: "2359",
      };

      const finalParams = { ...defaultParams, ...params };
      const result = await executeGetReports(finalParams);
      // Extract only the data from the response
      const responseData = (result as { data?: unknown })?.data || result;
      setResponse((prev) => ({
        ...prev,
        reports: responseData as string | object,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSendMomentary = async (data: MomentaryRequest) => {
    try {
      const result = await executeMomentary(data);
      setResponse((prev) => ({
        ...prev,
        momentary: result as string | object,
      }));
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
    // Queue Cars
    handleGetQueueCars,
    isLoadingQueueCars,
    queueCarsError,
    // Update Car
    handleUpdateCar,
    isUpdatingCar,
    updateCarError,
    // Delete Car
    handleDeleteCar,
    isDeletingCar,
    deleteCarError,
    // Momentary
    handleSendMomentary,
    isSendingMomentary,
    momentaryError,
    // Statistics
    handleGetStatistics,
    isLoadingStats,
    statsError,
    // Heartbeat
    handleGetHeartBeat,
    isLoadingHeartbeat,
    heartbeatError,
    // Local Heartbeat
    handleGetLocalHeartBeat,
    isLoadingLocalHeartbeat,
    localHeartbeatError,
    // Reports
    handleGetReports,
    isLoadingReports,
    reportsError,
  };
};

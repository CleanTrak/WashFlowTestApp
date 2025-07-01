import { useState } from "react";
import { ErrorDisplay } from "./components/ErrorDisplay/ErrorDisplay";
import { CarForm } from "./components/CarForm/CarForm";
import { CredentialsForm } from "./components/CredentialsForm/CredentialsForm";
import {
  StatisticsSection,
  HeartbeatSection,
  ReportsSection,
} from "./components/ApiSections";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useCredentials } from "./hooks/useCredentials";
import { useApiOperations } from "./hooks/useApiOperations";
import type { WashQueueCarRequest } from "./types";

function App() {
  const [carData, setCarData] = useState<WashQueueCarRequest>({
    invoice_id: "",
    wash_pkg_num: 1,
    position_in_queue: 0,
    wash_opt_numbers: [],
    license_plate: "",
    make: "",
    model: "",
    color: "",
    vehicle_type: "",
    region: "",
    image_urls: [],
  });

  const {
    credentials,
    updateCredential,
    applyCredentials,
    isConfigured,
    isValid: credentialsValid,
  } = useCredentials();

  const apiOperations = useApiOperations(
    credentials.companyId,
    credentials.tunnelId,
    credentials.deviceId
  );

  const updateCarData = (updates: Partial<WashQueueCarRequest>) => {
    setCarData((prev) => ({ ...prev, ...updates }));
  };

  if (!isConfigured) {
    return (
      <CredentialsForm
        credentials={credentials}
        onUpdateCredential={updateCredential}
        onSubmit={applyCredentials}
        isValid={credentialsValid}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              WashFlow Test App
            </h1>
            <p className="text-gray-600">Car wash controller testing</p>
          </div>

          <ErrorDisplay
            error={apiOperations.error}
            onClose={() => apiOperations.setError("")}
          />

          <CarForm
            carData={carData}
            onUpdateCarData={updateCarData}
            onAddCar={apiOperations.handleAddCar}
            isAddingCar={apiOperations.isAddingCar}
            addCarResponse={apiOperations.response.addCar ?? null}
            addCarError={apiOperations.addCarError}
          />

          <StatisticsSection
            onGetStatistics={apiOperations.handleGetStatistics}
            isLoading={apiOperations.isLoadingStats}
            response={apiOperations.response.statistics}
            error={apiOperations.statsError}
          />

          <HeartbeatSection
            onGetHeartbeat={apiOperations.handleGetHeartBeat}
            isLoading={apiOperations.isLoadingHeartbeat}
            response={apiOperations.response.heartBeat}
            error={apiOperations.heartbeatError}
            deviceId={credentials.deviceId}
          />

          <ReportsSection
            onGetReports={apiOperations.handleGetReports}
            isLoading={apiOperations.isLoadingReports}
            response={apiOperations.response.reports}
            error={apiOperations.reportsError}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

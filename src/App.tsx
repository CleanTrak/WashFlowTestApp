import { ErrorDisplay } from "./components/ErrorDisplay/ErrorDisplay";
import { WashQueue } from "./components/WashQueue";
import { Momentary } from "./components/Momentary";
import { CredentialsForm } from "./components/CredentialsForm/CredentialsForm";
import {
  StatisticsSection,
  HeartbeatSection,
  ReportsSection,
} from "./components/ApiSections";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useCredentials } from "./hooks/useCredentials";
import { useApiOperations } from "./hooks/useApiOperations";

function App() {
  const {
    credentials,
    authData,
    updateCredential,
    applyCredentials,
    clearCredentials,
    isConfigured,
    isValid: credentialsValid,
    isValidating,
    validationError,
  } = useCredentials();

  const apiOperations = useApiOperations(
    authData.companyId,
    authData.tunnelId,
    authData.deviceId
  );

  const handleCredentialsSubmit = async () => {
    await applyCredentials();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <CredentialsForm
            credentials={credentials}
            onUpdateCredential={updateCredential}
            onSubmit={handleCredentialsSubmit}
            onClear={clearCredentials}
            isValid={credentialsValid}
            isValidating={isValidating}
            validationError={validationError}
          />

          <div
            className={`space-y-6 transition-opacity duration-300 ${
              isConfigured ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
          >
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

            <WashQueue
              onAddCar={apiOperations.handleAddCar}
              isAddingCar={apiOperations.isAddingCar}
              addCarResponse={apiOperations.response.addCar ?? null}
              addCarError={apiOperations.addCarError}
              queueCars={apiOperations.response.queueCars}
              onGetQueueCars={apiOperations.handleGetQueueCars}
              isLoadingQueueCars={apiOperations.isLoadingQueueCars}
              queueCarsError={apiOperations.queueCarsError}
              onUpdateCar={apiOperations.handleUpdateCar}
              isUpdatingCar={apiOperations.isUpdatingCar}
              onDeleteCar={apiOperations.handleDeleteCar}
              isDeletingCar={apiOperations.isDeletingCar}
            />

            <Momentary
              onSendMomentary={apiOperations.handleSendMomentary}
              isSending={apiOperations.isSendingMomentary}
              response={apiOperations.response.momentary ?? null}
              error={apiOperations.momentaryError}
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
              deviceId={authData.deviceId}
            />

            <ReportsSection
              onGetReports={apiOperations.handleGetReports}
              isLoading={apiOperations.isLoadingReports}
              response={apiOperations.response.reports}
              error={apiOperations.reportsError}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

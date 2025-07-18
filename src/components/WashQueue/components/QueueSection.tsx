import React from "react";
import { Button } from "../../ui/Button";
import type { QueueCarsResponse, WashQueueCar } from "../../../types";

interface QueueSectionProps {
  queueCars: QueueCarsResponse | undefined;
  onGetQueueCars: () => void;
  isLoadingQueueCars: boolean;
  queueCarsError: Error | null;
  onEditCar: (car: WashQueueCar) => void;
  onDeleteCar: (invoiceId: string) => void;
  isDeletingCar: boolean;
  deletingCarId: string | null;
  lastSuccessfulOperation: {
    type: "edit" | "delete";
    invoiceId: string;
    timestamp: number;
  } | null;
}

export const QueueSection: React.FC<QueueSectionProps> = ({
  queueCars,
  onGetQueueCars,
  isLoadingQueueCars,
  queueCarsError,
  onEditCar,
  onDeleteCar,
  isDeletingCar,
  deletingCarId,
  lastSuccessfulOperation,
}) => {
  const handleDeleteClick = (invoiceId: string) => {
    if (confirm(`Are you sure you want to delete car ${invoiceId}?`)) {
      onDeleteCar(invoiceId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-700">Cars in Queue</h4>
        <Button
          onClick={onGetQueueCars}
          isLoading={isLoadingQueueCars}
          loadingText="Refreshing..."
          className="text-sm"
        >
          Refresh Queue
        </Button>
      </div>

      {/* Success Message */}
      {lastSuccessfulOperation && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          Car {lastSuccessfulOperation.invoiceId} was successfully{" "}
          {lastSuccessfulOperation.type === "edit" ? "updated" : "deleted"}!
        </div>
      )}

      {queueCarsError && (
        <div className="text-red-600 text-sm">
          <strong>Error:</strong> {queueCarsError.message}
        </div>
      )}

      {queueCars && queueCars.cars.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Total cars: {queueCars.total_count}
          </div>

          <div className="grid gap-4">
            {queueCars.cars.map((car) => (
              <div
                key={car.invoice_id}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Invoice ID:
                      </span>
                      <div className="text-sm text-gray-900">
                        {car.invoice_id}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Package:
                      </span>
                      <div className="text-sm text-gray-900">
                        {car.wash_package_name} (#{car.wash_pkg_num})
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Position:
                      </span>
                      <div className="text-sm text-gray-900">
                        {car.position_in_queue}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        State:
                      </span>
                      <div className="text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            car.state === "IN_QUEUE"
                              ? "bg-blue-100 text-blue-800"
                              : car.state === "WASHING"
                              ? "bg-yellow-100 text-yellow-800"
                              : car.state === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {car.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => onEditCar(car)}
                      className="text-xs px-3 py-1"
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(car.invoice_id)}
                      className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
                      disabled={
                        isDeletingCar && deletingCarId === car.invoice_id
                      }
                    >
                      {isDeletingCar && deletingCarId === car.invoice_id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {car.license_plate && (
                    <div>
                      <span className="text-gray-700 font-medium">
                        License:
                      </span>
                      <div className="text-gray-900">{car.license_plate}</div>
                    </div>
                  )}
                  {car.make && (
                    <div>
                      <span className="text-gray-700 font-medium">Make:</span>
                      <div className="text-gray-900">{car.make}</div>
                    </div>
                  )}
                  {car.model && (
                    <div>
                      <span className="text-gray-700 font-medium">Model:</span>
                      <div className="text-gray-900">{car.model}</div>
                    </div>
                  )}
                  {car.color && (
                    <div>
                      <span className="text-gray-700 font-medium">Color:</span>
                      <div className="text-gray-900">{car.color}</div>
                    </div>
                  )}
                </div>

                {car.opt_nums.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-700 font-medium">
                      Wash Options:
                    </span>
                    <div className="text-gray-900">
                      {car.opt_nums.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : queueCars && queueCars.cars.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No cars in queue</div>
      ) : null}
    </div>
  );
};

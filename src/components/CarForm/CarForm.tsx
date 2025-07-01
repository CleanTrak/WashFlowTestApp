import React from "react";
import { Button } from "../ui/Button";
import { Card, JsonViewer } from "../ui/Card";
import { isFormValid } from "../../utils/validation";
import type { WashQueueCarRequest } from "../../types";

interface CarFormProps {
  carData: WashQueueCarRequest;
  onUpdateCarData: (updates: Partial<WashQueueCarRequest>) => void;
  onAddCar: (carData: WashQueueCarRequest) => void;
  isAddingCar: boolean;
  addCarResponse: string | object | null;
  addCarError: Error | null;
}

export const CarForm: React.FC<CarFormProps> = ({
  carData,
  onUpdateCarData,
  onAddCar,
  isAddingCar,
  addCarResponse,
  addCarError,
}) => {
  const handleInputChange =
    (field: keyof WashQueueCarRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "wash_pkg_num"
          ? parseInt(e.target.value) || 0
          : e.target.value;

      onUpdateCarData({ [field]: value });
    };

  const inputClass =
    "w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none";

  return (
    <Card title="Add Car to Queue">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={carData.invoice_id}
              onChange={handleInputChange("invoice_id")}
              placeholder="ABC123444"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wash Package Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={carData.wash_pkg_num || ""}
              onChange={handleInputChange("wash_pkg_num")}
              placeholder="1"
              min="1"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate
            </label>
            <input
              type="text"
              value={carData.license_plate}
              onChange={handleInputChange("license_plate")}
              placeholder="ABC123"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <input
              type="text"
              value={carData.make}
              onChange={handleInputChange("make")}
              placeholder="Toyota"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              value={carData.model}
              onChange={handleInputChange("model")}
              placeholder="Camry"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              value={carData.color}
              onChange={handleInputChange("color")}
              placeholder="Blue"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <input
              type="text"
              value={carData.vehicle_type}
              onChange={handleInputChange("vehicle_type")}
              placeholder="Sedan"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <input
              type="text"
              value={carData.region}
              onChange={handleInputChange("region")}
              placeholder="CA"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={() => onAddCar(carData)}
          isLoading={isAddingCar}
          loadingText="Adding car..."
          disabled={!isFormValid(carData)}
        >
          Add car to queue
        </Button>
        {addCarResponse &&
          (typeof addCarResponse === "object" ||
            typeof addCarResponse === "string") && (
            <JsonViewer
              data={addCarResponse as string | object}
              className="mt-4"
            />
          )}
        {addCarError && (
          <div className="mt-2 text-red-600 text-sm">{addCarError.message}</div>
        )}
      </div>
    </Card>
  );
};

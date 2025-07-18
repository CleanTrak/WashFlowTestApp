import React from "react";
import { Button } from "../../ui/Button";
import { JsonViewer } from "../../ui/Card";
import { CarFormFields } from "./CarFormFields";
import { isFormValid } from "../../../utils/validation";
import type { WashQueueCarRequest } from "../../../types";

interface AddCarSectionProps {
  carData: WashQueueCarRequest;
  onUpdateCarData: (updates: Partial<WashQueueCarRequest>) => void;
  onAddCar: (carData: WashQueueCarRequest) => void;
  isAddingCar: boolean;
  addCarResponse: string | object | null;
  addCarError: Error | null;
}

export const AddCarSection: React.FC<AddCarSectionProps> = ({
  carData,
  onUpdateCarData,
  onAddCar,
  isAddingCar,
  addCarResponse,
  addCarError,
}) => {
  const handleFieldChange = (
    field: keyof WashQueueCarRequest,
    value: string | number
  ) => {
    onUpdateCarData({ [field]: value });
  };

  const handleWashOptNumbersChange = (numbers: number[]) => {
    onUpdateCarData({ wash_opt_numbers: numbers });
  };

  const handleImageUrlsChange = (urls: string[]) => {
    onUpdateCarData({ image_urls: urls });
  };

  return (
    <div className="space-y-4">
      <CarFormFields
        data={carData}
        onFieldChange={handleFieldChange}
        onWashOptNumbersChange={handleWashOptNumbersChange}
        onImageUrlsChange={handleImageUrlsChange}
        showInvoiceId={true}
        disabled={isAddingCar}
      />

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
    </div>
  );
};

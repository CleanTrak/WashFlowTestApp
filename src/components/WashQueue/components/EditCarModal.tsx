import React from "react";
import { Button } from "../../ui/Button";
import { CarFormFields } from "./CarFormFields";
import type { WashQueueCar, WashQueueCarRequest } from "../../../types";

interface EditCarModalProps {
  car: WashQueueCar | null;
  editFormData: Partial<WashQueueCarRequest>;
  onEditFormDataChange: (updates: Partial<WashQueueCarRequest>) => void;
  onSave: (invoiceId: string, carData: Partial<WashQueueCarRequest>) => void;
  onCancel: () => void;
  isUpdating: boolean;
}

export const EditCarModal: React.FC<EditCarModalProps> = ({
  car,
  editFormData,
  onEditFormDataChange,
  onSave,
  onCancel,
  isUpdating,
}) => {
  if (!car) return null;

  const handleFieldChange = (
    field: keyof WashQueueCarRequest,
    value: string | number
  ) => {
    onEditFormDataChange({ [field]: value });
  };

  const handleWashOptNumbersChange = (numbers: number[]) => {
    onEditFormDataChange({ wash_opt_numbers: numbers });
  };

  const handleImageUrlsChange = (urls: string[]) => {
    onEditFormDataChange({ image_urls: urls });
  };

  const handleSave = () => {
    onSave(car.invoice_id, editFormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Car: {car.invoice_id}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <CarFormFields
          data={editFormData}
          onFieldChange={handleFieldChange}
          onWashOptNumbersChange={handleWashOptNumbersChange}
          onImageUrlsChange={handleImageUrlsChange}
          showInvoiceId={false}
          disabled={isUpdating}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={onCancel} variant="secondary" disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isUpdating}
            loadingText="Saving..."
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

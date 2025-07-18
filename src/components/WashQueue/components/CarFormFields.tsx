import React from "react";
import type { WashQueueCarRequest } from "../../../types";

interface CarFormFieldsProps {
  data: WashQueueCarRequest | Partial<WashQueueCarRequest>;
  onFieldChange: (
    field: keyof WashQueueCarRequest,
    value: string | number
  ) => void;
  onWashOptNumbersChange: (numbers: number[]) => void;
  onImageUrlsChange: (urls: string[]) => void;
  showInvoiceId?: boolean;
  disabled?: boolean;
}

export const CarFormFields: React.FC<CarFormFieldsProps> = ({
  data,
  onFieldChange,
  onWashOptNumbersChange,
  onImageUrlsChange,
  showInvoiceId = true,
  disabled = false,
}) => {
  const inputClass = `w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
    disabled ? "bg-gray-100 cursor-not-allowed" : ""
  }`;

  const handleWashOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value
      ? value
          .split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n))
      : [];
    onWashOptNumbersChange(numbers);
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const urls = value
      ? value
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url)
      : [];
    onImageUrlsChange(urls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showInvoiceId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(data as WashQueueCarRequest).invoice_id || ""}
              onChange={(e) => onFieldChange("invoice_id", e.target.value)}
              placeholder="ABC123444"
              className={inputClass}
              disabled={disabled}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wash Package Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.wash_pkg_num || ""}
            onChange={(e) =>
              onFieldChange("wash_pkg_num", parseInt(e.target.value) || 0)
            }
            placeholder="1"
            min="1"
            className={inputClass}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position in Queue{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="number"
            value={data.position_in_queue || ""}
            onChange={(e) =>
              onFieldChange("position_in_queue", parseInt(e.target.value) || 0)
            }
            placeholder="Leave empty for auto-assign"
            min="1"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wash Options{" "}
            <span className="text-gray-400 text-xs">
              (optional, comma-separated)
            </span>
          </label>
          <input
            type="text"
            value={data.wash_opt_numbers?.join(", ") || ""}
            onChange={handleWashOptChange}
            placeholder="5, 8, 12"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Plate{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.license_plate || ""}
            onChange={(e) => onFieldChange("license_plate", e.target.value)}
            placeholder="ABC123"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.make || ""}
            onChange={(e) => onFieldChange("make", e.target.value)}
            placeholder="Toyota"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.model || ""}
            onChange={(e) => onFieldChange("model", e.target.value)}
            placeholder="Camry"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.color || ""}
            onChange={(e) => onFieldChange("color", e.target.value)}
            placeholder="Blue"
            className={inputClass}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Type <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={data.car_type || ""}
            onChange={(e) => onFieldChange("car_type", e.target.value)}
            className={inputClass}
            disabled={disabled}
          >
            <option value="">Select car type</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="TRUCK">Truck</option>
            <option value="COUPE">Coupe</option>
            <option value="WAGON">Wagon</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.region || ""}
            onChange={(e) => onFieldChange("region", e.target.value)}
            placeholder="CA"
            className={inputClass}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URLs{" "}
          <span className="text-gray-400 text-xs">
            (optional, comma-separated)
          </span>
        </label>
        <input
          type="text"
          value={data.image_urls?.join(", ") || ""}
          onChange={handleImageUrlsChange}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className={inputClass}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

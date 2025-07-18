import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { isFormValid } from "../../utils/validation";
import type {
  WashQueueCarRequest,
  WashQueueCar,
  QueueCarsResponse,
} from "../../types";

interface WashQueueProps {
  onAddCar: (carData: WashQueueCarRequest) => void;
  isAddingCar: boolean;
  addCarResponse: string | object | null;
  addCarError: Error | null;
  queueCars: QueueCarsResponse | undefined;
  onGetQueueCars: () => void;
  isLoadingQueueCars: boolean;
  queueCarsError: Error | null;
  onUpdateCar: (
    invoiceId: string,
    carData: Partial<WashQueueCarRequest>
  ) => void;
  isUpdatingCar: boolean;
  onDeleteCar: (invoiceId: string) => void;
  isDeletingCar: boolean;
}

export const WashQueue: React.FC<WashQueueProps> = ({
  onAddCar,
  isAddingCar,
  addCarResponse,
  addCarError,
  queueCars,
  onGetQueueCars,
  isLoadingQueueCars,
  queueCarsError,
  onUpdateCar,
  isUpdatingCar,
  onDeleteCar,
  isDeletingCar,
}) => {
  const [carData, setCarData] = useState<WashQueueCarRequest>({
    invoice_id: "",
    wash_pkg_num: 1,
    position_in_queue: 0,
    wash_opt_numbers: [],
    license_plate: "",
    make: "",
    model: "",
    color: "",
    car_type: "",
    region: "",
    image_urls: [],
  });
  const [activeTab, setActiveTab] = useState<"add" | "queue">("add");
  const [editingCar, setEditingCar] = useState<WashQueueCar | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<WashQueueCarRequest>
  >({});
  const [hasLoadedQueue, setHasLoadedQueue] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [lastSuccessfulOperation, setLastSuccessfulOperation] = useState<{
    type: "edit" | "delete";
    invoiceId: string;
    timestamp: number;
  } | null>(null);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (lastSuccessfulOperation) {
      const timer = setTimeout(() => {
        setLastSuccessfulOperation(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSuccessfulOperation]);

  useEffect(() => {
    // Only load queue data once when switching to queue tab for the first time
    if (activeTab === "queue" && !hasLoadedQueue && !queueCars) {
      onGetQueueCars();
      setHasLoadedQueue(true);
    }
  }, [activeTab, hasLoadedQueue, queueCars, onGetQueueCars]);

  const updateCarData = (updates: Partial<WashQueueCarRequest>) => {
    setCarData((prev) => ({ ...prev, ...updates }));
  };

  const handleInputChange =
    (field: keyof WashQueueCarRequest, isEdit = false) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "wash_pkg_num" || field === "position_in_queue"
          ? parseInt(e.target.value) || 0
          : e.target.value;

      if (isEdit) {
        setEditFormData((prev) => ({ ...prev, [field]: value }));
      } else {
        updateCarData({ [field]: value });
      }
    };

  const handleWashOptNumbersChange =
    (isEdit = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numbers = value
        ? value
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n))
        : [];

      if (isEdit) {
        setEditFormData((prev) => ({ ...prev, wash_opt_numbers: numbers }));
      } else {
        updateCarData({ wash_opt_numbers: numbers });
      }
    };

  const handleImageUrlsChange =
    (isEdit = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const urls = value
        ? value
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url)
        : [];

      if (isEdit) {
        setEditFormData((prev) => ({ ...prev, image_urls: urls }));
      } else {
        updateCarData({ image_urls: urls });
      }
    };

  const startEdit = (car: WashQueueCar) => {
    setEditingCar(car);
    setEditFormData({
      wash_pkg_num: car.wash_pkg_num,
      position_in_queue: car.position_in_queue,
      wash_opt_numbers: car.opt_nums,
      license_plate: car.license_plate || "",
      make: car.make || "",
      model: car.model || "",
      color: car.color || "",
      car_type: car.car_type,
      region: car.region || "",
      image_urls: car.image_urls,
    });
  };

  const cancelEdit = () => {
    setEditingCar(null);
    setEditFormData({});
  };

  const saveEdit = async () => {
    if (editingCar) {
      try {
        await onUpdateCar(editingCar.invoice_id, editFormData);
        setEditingCar(null);
        setEditFormData({});
        setLastSuccessfulOperation({
          type: "edit",
          invoiceId: editingCar.invoice_id,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Error saving edit:", error);
      }
    }
  };

  const handleDeleteCar = async (invoiceId: string) => {
    setDeletingCarId(invoiceId);
    try {
      await onDeleteCar(invoiceId);
      setLastSuccessfulOperation({
        type: "delete",
        invoiceId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setDeletingCarId(null);
    }
  };

  const handleRefresh = () => {
    onGetQueueCars();
    setHasLoadedQueue(true);
  };

  const inputClass =
    "w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none";

  const renderCarForm = (
    data: WashQueueCarRequest | Partial<WashQueueCarRequest>,
    isEdit = false
  ) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(data as WashQueueCarRequest).invoice_id}
              onChange={handleInputChange("invoice_id", isEdit)}
              placeholder="ABC123444"
              className={inputClass}
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
            onChange={handleInputChange("wash_pkg_num", isEdit)}
            placeholder="1"
            min="1"
            className={inputClass}
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
            onChange={handleInputChange("position_in_queue", isEdit)}
            placeholder="Leave empty for auto-assign"
            min="1"
            className={inputClass}
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
            onChange={handleWashOptNumbersChange(isEdit)}
            placeholder="5, 8, 12"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Plate{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.license_plate}
            onChange={handleInputChange("license_plate", isEdit)}
            placeholder="ABC123"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.make}
            onChange={handleInputChange("make", isEdit)}
            placeholder="Toyota"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.model}
            onChange={handleInputChange("model", isEdit)}
            placeholder="Camry"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={data.color}
            onChange={handleInputChange("color", isEdit)}
            placeholder="Blue"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Type <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={data.car_type}
            onChange={handleInputChange("car_type", isEdit)}
            className={inputClass}
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
            value={data.region}
            onChange={handleInputChange("region", isEdit)}
            placeholder="CA"
            className={inputClass}
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
          onChange={handleImageUrlsChange(isEdit)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className={inputClass}
        />
      </div>
    </div>
  );

  return (
    <Card title="Wash Queue Management">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "add"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Car
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "queue"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("queue")}
          >
            Queue ({queueCars?.total_count || 0})
          </button>
        </div>
      </div>

      {activeTab === "add" && (
        <div>
          {renderCarForm(carData)}
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
                <div>
                  <div className="mt-2 text-green-600 text-sm">
                    ✓ Car added successfully. Switch to Queue tab and refresh to
                    see updates.
                  </div>
                </div>
              )}
            {addCarError && (
              <div className="mt-2 text-red-600 text-sm">
                {addCarError.message}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "queue" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Cars in Queue</h3>
            <Button
              onClick={handleRefresh}
              isLoading={isLoadingQueueCars}
              loadingText="Loading..."
              variant="secondary"
              size="sm"
            >
              Refresh
            </Button>
          </div>

          {queueCarsError && (
            <div className="mb-4 text-red-600 text-sm">
              {queueCarsError.message}
            </div>
          )}

          {lastSuccessfulOperation && (
            <div className="mb-4 text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">
              ✓ Car {lastSuccessfulOperation.invoiceId}{" "}
              {lastSuccessfulOperation.type === "edit" ? "updated" : "deleted"}{" "}
              successfully. Click Refresh to see the latest changes.
            </div>
          )}

          {queueCars?.cars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cars in queue
            </div>
          ) : (
            <div className="space-y-4">
              {queueCars?.cars.map((car) => (
                <div
                  key={car.invoice_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {editingCar?.invoice_id === car.invoice_id ? (
                    <div>
                      <h4 className="font-medium mb-3">
                        Edit Car: {car.invoice_id}
                      </h4>
                      {renderCarForm(editFormData, true)}
                      <div className="mt-4 flex gap-2">
                        <Button
                          onClick={saveEdit}
                          isLoading={isUpdatingCar}
                          loadingText="Saving..."
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="secondary"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">
                            Invoice: {car.invoice_id}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Position: {car.position_in_queue} | State:{" "}
                            {car.state}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(car)}
                            variant="secondary"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteCar(car.invoice_id)}
                            variant="danger"
                            size="sm"
                            isLoading={
                              isDeletingCar && deletingCarId === car.invoice_id
                            }
                            loadingText="Deleting..."
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Package:</span>{" "}
                          {car.wash_pkg_num}
                        </div>
                        <div>
                          <span className="font-medium">License:</span>{" "}
                          {car.license_plate || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Make:</span>{" "}
                          {car.make || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Model:</span>{" "}
                          {car.model || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Color:</span>{" "}
                          {car.color || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {car.car_type}
                        </div>
                        <div>
                          <span className="font-medium">Region:</span>{" "}
                          {car.region || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(car.wash_create_time).toLocaleString()}
                        </div>
                      </div>

                      {car.opt_nums.length > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Options:</span>{" "}
                          {car.opt_nums.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

import React, { useState, useEffect } from "react";
import { Card } from "../../ui/Card";
import { WashQueueTabs, type WashQueueTab } from "./WashQueueTabs";
import { AddCarSection } from "./AddCarSection";
import { QueueSection } from "./QueueSection";
import { EditCarModal } from "./EditCarModal";
import type {
  WashQueueCarRequest,
  WashQueueCar,
  QueueCarsResponse,
} from "../../../types";

interface WashQueueContainerProps {
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

export const WashQueueContainer: React.FC<WashQueueContainerProps> = ({
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
  // Form state for adding cars
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

  // UI state
  const [activeTab, setActiveTab] = useState<WashQueueTab>("add");
  const [hasLoadedQueue, setHasLoadedQueue] = useState(false);

  // Edit modal state
  const [editingCar, setEditingCar] = useState<WashQueueCar | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<WashQueueCarRequest>
  >({});

  // Delete state
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

  // Success notification state
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

  // Load queue data when switching to queue tab
  useEffect(() => {
    if (activeTab === "queue" && !hasLoadedQueue && !queueCars) {
      onGetQueueCars();
      setHasLoadedQueue(true);
    }
  }, [activeTab, hasLoadedQueue, queueCars, onGetQueueCars]);

  // Car data handlers
  const updateCarData = (updates: Partial<WashQueueCarRequest>) => {
    setCarData((prev) => ({ ...prev, ...updates }));
  };

  // Edit modal handlers
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

  const saveEdit = async (
    invoiceId: string,
    carData: Partial<WashQueueCarRequest>
  ) => {
    try {
      await onUpdateCar(invoiceId, carData);
      setLastSuccessfulOperation({
        type: "edit",
        invoiceId,
        timestamp: Date.now(),
      });
      cancelEdit();
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const updateEditFormData = (updates: Partial<WashQueueCarRequest>) => {
    setEditFormData((prev) => ({ ...prev, ...updates }));
  };

  // Delete handlers
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

  return (
    <>
      <Card title="Wash Queue">
        <WashQueueTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "add" && (
          <AddCarSection
            carData={carData}
            onUpdateCarData={updateCarData}
            onAddCar={onAddCar}
            isAddingCar={isAddingCar}
            addCarResponse={addCarResponse}
            addCarError={addCarError}
          />
        )}

        {activeTab === "queue" && (
          <QueueSection
            queueCars={queueCars}
            onGetQueueCars={onGetQueueCars}
            isLoadingQueueCars={isLoadingQueueCars}
            queueCarsError={queueCarsError}
            onEditCar={startEdit}
            onDeleteCar={handleDeleteCar}
            isDeletingCar={isDeletingCar}
            deletingCarId={deletingCarId}
            lastSuccessfulOperation={lastSuccessfulOperation}
          />
        )}
      </Card>

      <EditCarModal
        car={editingCar}
        editFormData={editFormData}
        onEditFormDataChange={updateEditFormData}
        onSave={saveEdit}
        onCancel={cancelEdit}
        isUpdating={isUpdatingCar}
      />
    </>
  );
};

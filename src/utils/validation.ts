import type { WashQueueCarRequest } from "../types";

export const isFormValid = (carData: WashQueueCarRequest): boolean => {
  return carData.invoice_id.trim() !== "" && carData.wash_pkg_num >= 1;
};

export const cleanCarData = (
  carData: WashQueueCarRequest
): Partial<WashQueueCarRequest> => {
  const cleaned: Partial<WashQueueCarRequest> = {
    invoice_id: carData.invoice_id,
    wash_pkg_num: carData.wash_pkg_num,
  };

  // Only include optional fields if they have values
  if (carData.position_in_queue >= 1) {
    cleaned.position_in_queue = carData.position_in_queue;
  }

  if (carData.wash_opt_numbers.length > 0) {
    cleaned.wash_opt_numbers = carData.wash_opt_numbers;
  }

  if (carData.license_plate.trim()) {
    cleaned.license_plate = carData.license_plate.trim();
  }

  if (carData.make.trim()) {
    cleaned.make = carData.make.trim();
  }

  if (carData.model.trim()) {
    cleaned.model = carData.model.trim();
  }

  if (carData.color.trim()) {
    cleaned.color = carData.color.trim();
  }

  if (carData.car_type.trim()) {
    cleaned.car_type = carData.car_type.trim();
  }

  if (carData.region.trim()) {
    cleaned.region = carData.region.trim();
  }

  if (carData.image_urls.length > 0) {
    // Filter out empty URLs
    const validUrls = carData.image_urls.filter((url) => url.trim());
    if (validUrls.length > 0) {
      cleaned.image_urls = validUrls;
    }
  }

  return cleaned;
};

export const cleanPartialCarData = (
  carData: Partial<WashQueueCarRequest>
): Partial<WashQueueCarRequest> => {
  const cleaned: Partial<WashQueueCarRequest> = {};

  // Only include fields that are defined and have values
  if (carData.wash_pkg_num !== undefined && carData.wash_pkg_num >= 1) {
    cleaned.wash_pkg_num = carData.wash_pkg_num;
  }

  if (
    carData.position_in_queue !== undefined &&
    carData.position_in_queue >= 1
  ) {
    cleaned.position_in_queue = carData.position_in_queue;
  }

  if (
    carData.wash_opt_numbers !== undefined &&
    carData.wash_opt_numbers.length > 0
  ) {
    cleaned.wash_opt_numbers = carData.wash_opt_numbers;
  }

  if (carData.license_plate !== undefined && carData.license_plate.trim()) {
    cleaned.license_plate = carData.license_plate.trim();
  }

  if (carData.make !== undefined && carData.make.trim()) {
    cleaned.make = carData.make.trim();
  }

  if (carData.model !== undefined && carData.model.trim()) {
    cleaned.model = carData.model.trim();
  }

  if (carData.color !== undefined && carData.color.trim()) {
    cleaned.color = carData.color.trim();
  }

  if (carData.car_type !== undefined && carData.car_type.trim()) {
    cleaned.car_type = carData.car_type.trim();
  }

  if (carData.region !== undefined && carData.region.trim()) {
    cleaned.region = carData.region.trim();
  }

  if (carData.image_urls !== undefined && carData.image_urls.length > 0) {
    // Filter out empty URLs
    const validUrls = carData.image_urls.filter((url) => url.trim());
    if (validUrls.length > 0) {
      cleaned.image_urls = validUrls;
    }
  }

  return cleaned;
};

import type { WashQueueCarRequest } from "../types";

export const isFormValid = (carData: WashQueueCarRequest): boolean => {
  return carData.invoice_id.trim() !== "" && carData.wash_pkg_num > 0;
};

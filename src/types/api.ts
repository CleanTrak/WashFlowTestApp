// Momentary types
export interface MomentaryRequest {
  momentary_numbers: number[];
}

// Wash Queue types
export interface WashQueueCarRequest {
  invoice_id: string;
  wash_pkg_num: number;
  position_in_queue: number;
  wash_opt_numbers: number[];
  license_plate: string;
  make: string;
  model: string;
  color: string;
  car_type: string;
  region: string;
  image_urls: string[];
}

export interface WashQueueCar {
  car_type: string;
  color: string | null;
  distance: number;
  image_urls: string[];
  invoice_id: string;
  length_inches: number;
  license_plate: string | null;
  make: string | null;
  model: string | null;
  opt_nums: number[];
  position_in_queue: number;
  pulses: number;
  region: string | null;
  source: string;
  state: "IN_QUEUE" | "WASHING" | "COMPLETED" | "CANCELLED";
  wash_create_time: string;
  wash_edit_time: string;
  wash_extras_names: string[];
  wash_extras_numbers: number[];
  wash_package_name: string;
  wash_pkg_num: number;
  wash_retracts_names: string[];
  wash_retracts_numbers: number[];
  wash_start_time: string | null;
}

export interface QueueCarsResponse {
  cars: WashQueueCar[];
  filters: {
    states: string[];
  };
  total_count: number;
}

export interface WashQueueCarResponse {
  invoice_id: string;
  position_in_queue: number;
  state: "IN_QUEUE" | "WASHING" | "COMPLETED" | "CANCELLED";
  wash_create_time: string;
  wash_edit_time: string;
  wash_extras_names: string[];
  wash_extras_numbers: number[];
  wash_package_name: string;
  wash_pkg_num: number;
  wash_retracts_names: string[];
  wash_retracts_numbers: number[];
  wash_start_time?: string;
  license_plate: string;
  source: string;
  make: string;
  model: string;
  color: string;
  vehicle_type: string;
  region: string;
  image_urls: string[];
}

// Reports types
export interface TransactionReport {
  car: {
    car_id: string;
    make: string;
    model: string;
    year: number;
    car_type: string;
    length_inches: number;
    front_wheel_position_inches: number;
    back_wheel_position_inches: number;
    license_plate: string;
    car_color: string;
    car_photo_url: string;
    customer: string;
  };
  date_time: {
    wash_create_time: string;
    wash_edit_time: string;
    wash_start_time: string;
    wash_complete_time: string;
  };
  wash_type: {
    wash_pkg_name: string;
    wash_pkg_num: number;
    wash_extras_numbers: number[];
    wash_extras_names: {
      wash_pkg_names: string[];
      price_in_cents: number[];
    };
    tunnel: string;
  };
  membership_type: string;
  current_car_photo_url: string;
  source: string;
  customer: string;
  tunnel: string;
}

export interface TransactionReportParams {
  start_datetime: string;
  end_datetime: string;
  timefilter_start: string;
  timefilter_end: string;
  licence_plate?: string;
  page?: number;
  pageSize?: number;
  period?: string;
}

import type { WashQueueCarRequest } from "../types";

interface CarPreset {
  make: string;
  model: string;
  color: string;
  car_type: string;
  // Photos of this exact make/model/color (Wikimedia Commons)
  image_urls: string[];
}

const COMMONS = "https://thumb.wikimedia.org/wikipedia/commons/thumb";

const CAR_PRESETS: CarPreset[] = [
  {
    make: "BMW",
    model: "M340i",
    color: "White",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/4/4e/BMW_G20_M340i_Alpine_White_%282%29.jpg/1280px-BMW_G20_M340i_Alpine_White_%282%29.jpg`,
      `${COMMONS}/3/32/BMW_G20_M340i_Alpine_White_%283%29.jpg/1280px-BMW_G20_M340i_Alpine_White_%283%29.jpg`,
      `${COMMONS}/9/93/BMW_G20_M340i_Alpine_White_%284%29.jpg/1280px-BMW_G20_M340i_Alpine_White_%284%29.jpg`,
    ],
  },
  {
    make: "BMW",
    model: "M340i",
    color: "Black",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/1/19/BMW_G20_M340i_Black_Sapphire_Metallic_%2810%29.jpg/1280px-BMW_G20_M340i_Black_Sapphire_Metallic_%2810%29.jpg`,
      `${COMMONS}/8/8d/BMW_G20_M340i_Black_Sapphire_Metallic_%2811%29.jpg/1280px-BMW_G20_M340i_Black_Sapphire_Metallic_%2811%29.jpg`,
    ],
  },
  {
    make: "Tesla",
    model: "Model 3",
    color: "White",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/6/63/18_Tesla_Model_3_Long_Range_%282%29.jpg/1280px-18_Tesla_Model_3_Long_Range_%282%29.jpg`,
      `${COMMONS}/c/c2/19_Tesla_Model_3_Long_Range.jpg/1280px-19_Tesla_Model_3_Long_Range.jpg`,
      `${COMMONS}/c/ce/20_Tesla_Model_3_Standard_%281%29.jpg/1280px-20_Tesla_Model_3_Standard_%281%29.jpg`,
    ],
  },
  {
    make: "Tesla",
    model: "Model 3",
    color: "Silver",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/8/8b/201803_Silver_Tesla_Model_3_01.jpg/1280px-201803_Silver_Tesla_Model_3_01.jpg`,
      `${COMMONS}/1/1d/201803_Silver_Tesla_Model_3_02.jpg/1280px-201803_Silver_Tesla_Model_3_02.jpg`,
      `${COMMONS}/c/c1/201803_Silver_Tesla_Model_3_03.jpg/1280px-201803_Silver_Tesla_Model_3_03.jpg`,
    ],
  },
  {
    make: "Tesla",
    model: "Model 3",
    color: "Gray",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/3/3c/0_Tesla_Model_3_2.jpg/1280px-0_Tesla_Model_3_2.jpg`,
      `${COMMONS}/4/42/0_Tesla_Model_3_3.jpg/1280px-0_Tesla_Model_3_3.jpg`,
    ],
  },
  {
    make: "Mercedes-Benz",
    model: "C250",
    color: "Blue",
    car_type: "SEDAN",
    image_urls: [
      `${COMMONS}/b/ba/Moscow%2C_Mercedes-Benz_C250_blue%2C_May_2026_02.jpg/1280px-Moscow%2C_Mercedes-Benz_C250_blue%2C_May_2026_02.jpg`,
      `${COMMONS}/c/c0/Moscow%2C_Mercedes-Benz_C250_blue%2C_May_2026_03.jpg/1280px-Moscow%2C_Mercedes-Benz_C250_blue%2C_May_2026_03.jpg`,
    ],
  },
  {
    make: "Jeep",
    model: "Wrangler",
    color: "Red",
    car_type: "SUV",
    image_urls: [
      `${COMMONS}/c/c1/2018_Jeep_Wrangler_Sport_S_2-door%2C_front_left%2C_09-30-2023.jpg/1280px-2018_Jeep_Wrangler_Sport_S_2-door%2C_front_left%2C_09-30-2023.jpg`,
      `${COMMONS}/b/bb/2018_Jeep_Wrangler_Sport_S_2-door%2C_rear_left%2C_09-30-2023.jpg/1280px-2018_Jeep_Wrangler_Sport_S_2-door%2C_rear_left%2C_09-30-2023.jpg`,
    ],
  },
  {
    make: "Jeep",
    model: "Wrangler",
    color: "Gray",
    car_type: "SUV",
    image_urls: [
      `${COMMONS}/0/04/2021_Jeep_Wrangler_JL_two-door_Islander_1of3.jpg/1280px-2021_Jeep_Wrangler_JL_two-door_Islander_1of3.jpg`,
      `${COMMONS}/9/97/2021_Jeep_Wrangler_JL_two-door_Islander_2of3.jpg/1280px-2021_Jeep_Wrangler_JL_two-door_Islander_2of3.jpg`,
    ],
  },
  {
    make: "Toyota",
    model: "RAV4",
    color: "Silver",
    car_type: "SUV",
    image_urls: [
      `${COMMONS}/0/0f/2019_Toyota_RAV4_LE_2.5L_front_4.14.19.jpg/1280px-2019_Toyota_RAV4_LE_2.5L_front_4.14.19.jpg`,
      `${COMMONS}/2/2d/2019_Toyota_RAV4_LE_2.5L_rear_4.14.19.jpg/1280px-2019_Toyota_RAV4_LE_2.5L_rear_4.14.19.jpg`,
    ],
  },
  {
    make: "Toyota",
    model: "RAV4",
    color: "Red",
    car_type: "SUV",
    image_urls: [
      `${COMMONS}/5/53/2019_Toyota_RAV4_XLE_AWD_front_red_3.20.19.jpg/1280px-2019_Toyota_RAV4_XLE_AWD_front_red_3.20.19.jpg`,
      `${COMMONS}/c/c7/2019_Toyota_RAV4_XLE_AWD_rear_red_3.20.19.jpg/1280px-2019_Toyota_RAV4_XLE_AWD_rear_red_3.20.19.jpg`,
    ],
  },
  {
    make: "Toyota",
    model: "RAV4",
    color: "White",
    car_type: "SUV",
    image_urls: [
      `${COMMONS}/4/46/2021_Toyota_RAV4_XLE_AWD%2C_front_right%2C_05-24-2026.jpg/1280px-2021_Toyota_RAV4_XLE_AWD%2C_front_right%2C_05-24-2026.jpg`,
      `${COMMONS}/9/95/2021_Toyota_RAV4_XLE_AWD%2C_rear_right%2C_05-24-2026.jpg/1280px-2021_Toyota_RAV4_XLE_AWD%2C_rear_right%2C_05-24-2026.jpg`,
    ],
  },
];

// Plate templates per US state: L = letter, D = digit
const PLATE_FORMATS: Record<string, string[]> = {
  CA: ["DLLLDDD"],
  MA: ["DLLDDD", "DLLLDD"],
  NY: ["LLLDDDD"],
  TX: ["LLLDDDD"],
  FL: ["LLLLDD", "DDDLLL"],
  NJ: ["LDDLLL"],
  IL: ["LLDDDDD"],
  WA: ["LLLDDDD"],
};

const FIRST_NAMES = [
  "James", "Michael", "Robert", "David", "William", "Daniel", "Matthew",
  "Mary", "Jennifer", "Linda", "Emily", "Sarah", "Jessica", "Ashley",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Moore",
];

// Empty string = non-member
const MEMBERSHIP_TYPES = ["", "Basic", "Silver", "Gold", "Platinum", "Unlimited"];

const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ";
const DIGITS = "0123456789";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(items: readonly T[]): T => items[randomInt(0, items.length - 1)];

const fillTemplate = (template: string) =>
  template
    .split("")
    .map((ch) => (ch === "L" ? pick([...LETTERS]) : ch === "D" ? pick([...DIGITS]) : ch))
    .join("");

const randomWashOptions = (): number[] => {
  const count = randomInt(0, 3);
  const options = new Set<number>();
  while (options.size < count) options.add(randomInt(1, 10));
  return [...options].sort((a, b) => a - b);
};

export const generateRandomCar = (): WashQueueCarRequest => {
  const preset = pick(CAR_PRESETS);
  const region = pick(Object.keys(PLATE_FORMATS));

  return {
    invoice_id: fillTemplate("LLLDDDDDD"),
    wash_pkg_num: randomInt(1, 4),
    // 0 = auto-assign (end of queue), so the request never points past the queue
    position_in_queue: 0,
    wash_opt_numbers: randomWashOptions(),
    license_plate: fillTemplate(pick(PLATE_FORMATS[region])),
    make: preset.make,
    model: preset.model,
    color: preset.color,
    car_type: preset.car_type,
    region,
    image_urls: [...preset.image_urls],
    customer_first_name: pick(FIRST_NAMES),
    customer_last_name: pick(LAST_NAMES),
    membership_type: pick(MEMBERSHIP_TYPES),
  };
};

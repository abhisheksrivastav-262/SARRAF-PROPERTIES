export const BUILDING_AMENITIES = [
  "Lift",
  "Security",
  "24 hours water supply",
  "Parking",
  "Gym",
  "Swimming pool",
  "Kids play area",
  "Garden",
] as const;

export const FURNISHING_ITEMS = [
  "Bed",
  "Wardrobe",
  "Dining table",
  "Kitchen cabinet",
  "Piped gas",
  "TV",
  "Fridge",
  "Washing machine",
  "AC",
  "Geyser",
  "Oven",
] as const;

const FURNISHING_STATUS_PREFIX = "__sarraf_furnishing_status__:";
const FURNISHING_ITEM_PREFIX = "__sarraf_furnishing_item__:";

export type FurnishingStatus = "" | "Furnished" | "Semi-furnished" | "Unfurnished";

export function parsePropertyAmenities(values: string[] | null | undefined) {
  const amenities: string[] = [];
  let furnishingStatus: FurnishingStatus = "";
  const furnishingItems: string[] = [];

  for (const value of values || []) {
    if (value.startsWith(FURNISHING_STATUS_PREFIX)) {
      const status = value.slice(FURNISHING_STATUS_PREFIX.length);
      if (["Furnished", "Semi-furnished", "Unfurnished"].includes(status)) {
        furnishingStatus = status as FurnishingStatus;
      }
    } else if (value.startsWith(FURNISHING_ITEM_PREFIX)) {
      furnishingItems.push(value.slice(FURNISHING_ITEM_PREFIX.length));
    } else if (value.trim()) {
      amenities.push(value.trim());
    }
  }

  return { amenities, furnishingStatus, furnishingItems };
}

export function serializePropertyAmenities(
  amenities: string[],
  furnishingStatus: FurnishingStatus,
  furnishingItems: string[],
) {
  return [
    ...amenities.map((value) => value.trim()).filter(Boolean),
    ...(furnishingStatus ? [`${FURNISHING_STATUS_PREFIX}${furnishingStatus}`] : []),
    ...furnishingItems.map((value) => `${FURNISHING_ITEM_PREFIX}${value}`),
  ];
}

export function propertyConfiguration(
  propertyType: "residential" | "commercial",
  bedrooms: number | null,
) {
  if (bedrooms === null) return "";
  if (propertyType === "commercial") return `${bedrooms} rooms`;
  if (bedrooms === 0) return "Studio / 1 RK";
  if (bedrooms >= 11) return "11+ BHK";
  return `${bedrooms} BHK`;
}

export function formatPropertyPrice(price: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  }
}

const smallNumberWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToWords(value: number): string {
  if (value < 20) return smallNumberWords[value] || "";
  if (value < 100) {
    const remainder = value % 10;
    return `${tensWords[Math.floor(value / 10)]}${remainder ? `-${smallNumberWords[remainder]}` : ""}`;
  }
  const units: [number, string][] = [
    [1_00_00_00_00_000, "kharab"],
    [1_00_00_00_000, "arab"],
    [1_00_00_000, "crore"],
    [1_00_000, "lakh"],
    [1_000, "thousand"],
    [100, "hundred"],
  ];
  for (const [size, label] of units) {
    if (value >= size) {
      const count = Math.floor(value / size);
      const remainder = value % size;
      return `${numberToWords(count)} ${label}${remainder ? ` ${numberToWords(remainder)}` : ""}`;
    }
  }
  return "";
}

export function formatPropertyPriceInWords(price: number, currency = "INR") {
  if (!Number.isFinite(price) || price < 0) return "";
  const roundedPrice = Math.round(price);
  const words = numberToWords(roundedPrice);
  const currencyName = currency.toUpperCase() === "INR" ? "rupees" : currency.toUpperCase();
  return `${words ? words[0]!.toUpperCase() + words.slice(1) : words} ${currencyName} only`;
}

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

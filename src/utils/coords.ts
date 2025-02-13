export const COORDINATE_PATTERN = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;


export function parseCoordinate(str: unknown) {
  if (typeof str !== "string" || !str.includes(",")) return null;

  // Trim whitespace from around the coordinates
  const _str = str.split(",").map(item => item.trim()).join(",");
  if (!_str.match(COORDINATE_PATTERN)) return null;

  // Return the coordinate object
  const [lat, lng] = _str.split(",");
  return {
    lat: +lat,
    lng: +lng,
  };
}

export function stringifyCoordinate(obj: { lat: string | number, lng: string | number } | unknown) {
  if (typeof obj !== "object" || !obj || !("lat" in obj) || !("lng" in obj)) return null;
  if (!["string", "number"].includes(typeof obj.lat) || !["string", "number"].includes(typeof obj.lng)) return null;

  return `${obj.lat},${obj.lng}`;
}
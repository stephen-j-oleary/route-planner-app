import polyline from "@mapbox/polyline";


export function decodePolyline(poly: string): { lat: number, lng: number }[] {
  return polyline.decode(poly).map(([lat, lng]) => ({ lat: lat / 10, lng: lng / 10 }));
}
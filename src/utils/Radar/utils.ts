import polyline from "@mapbox/polyline";
import countries from "world-countries";

export const getCountryCodes = () => countries.map(item => item.cca2);
export const getCountryName = (code: string) => countries.find(item => item.cca2 === code)?.name.common;
export const getCountryFlag = (code: string) => countries.find(item => item.cca2 === code)?.flag;

export function decodePolyline(poly: string): { lat: number, lng: number }[] {
  return polyline.decode(poly).map(([lat, lng]) => ({ lat: lat / 10, lng: lng / 10 }));
}
export type Address = {
  latitude: number,
  longitude: number,
  geometry: { type: string, coordinates: [number, number] },
  country: string,
  countryCode: string,
  countryFlag: string,
  county: string,
  distance: number,
  borough: string,
  city: string,
  number: string,
  neighborhood: string,
  postalCode: string,
  stateCode: string,
  state: string,
  street: string,
  layer: string,
  formattedAddress: string,
  placeLabel: string,
};

export type AutocompleteParams = {
  query: string,
  near?: string,
  country?: string,
  limit?: number,
};

export type AutocompleteResponse = {
  meta: { code: number },
  addresses: Address[],
};

type ValueText = {
  value: number,
  text: string,
};

type Location = {
  latitude: number,
  longitude: number,
};

export type DirectionsParams = {
  locations: string,
  /** Defaults to metric */
  units?: "metric" | "imperial",
};

export type DirectionsResponse = {
  meta: { code: number },
  routes: {
    distance: ValueText,
    duration: ValueText,
    legs: {
      stateLocation: Location,
      endLocation: Location,
      distance: ValueText,
      duration: ValueText,
      geometry: { polyline: string },
    }[],
  }[],
};

export type GeocodeParams = {
  query: string,
  country?: string,
};

export type GeocodeResponse = {
  meta: { code: number },
  addresses: Address[]
};

export type MatrixParams = {
  origins: string,
  destinations: string,
  /** Defaults to metric */
  units?: "metric" | "imperial",
};

export type MatrixResponse = {
  meta: { code: number },
  matrix: {
    distance: ValueText,
    duration: ValueText,
    originIndex: number,
    destinationIndex: number,
  }[][],
};
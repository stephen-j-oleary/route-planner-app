import httpClient from "./httpClient";

const EXTERNAL_API = process.env.LOOP_AUTOCOMPLETE_API;
const EXTERNAL_PK = process.env.LOOP_AUTOCOMPLETE_PK;


export type AutocompleteListParams = {
  query: string,
  near?: string,
  country?: string,
  limit?: number,
}

export type AutocompleteListResponse = {
  meta: { code: number },
  addresses: {
    latitude: number,
    longitude: number,
    geometry: { type: string, coordinates: number[] },
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
  }[],
}

const autocompleteApiClient = {
  async list(params: AutocompleteListParams) {
    if (!EXTERNAL_API || !EXTERNAL_PK) throw new Error("Invalid environment");

    const { data } = await httpClient.request<AutocompleteListResponse>({
      method: "get",
      url: EXTERNAL_API,
      headers: { "Authorization": EXTERNAL_PK },
      params,
    });

    return data;
  }
}

export default autocompleteApiClient;
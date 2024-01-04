import { filter, isEmpty } from "lodash";
import cache from "memory-cache";
import { InferType, number, object, string, ValidationError } from "yup";

import nextConnect from "@/nextConnect";
import isCustomerAuthenticated from "@/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/nextConnect/middleware/isUserAuthenticated";
import { Coordinates } from "@/types/coordinates";
import { RequestError } from "@/utils/ApiErrors";
import autocompleteApiClient from "@/utils/autocompleteClient";

const CACHE_TIME = 5 * 60 * 1000; // 5 mins
const DEFAULT_RESULT_LIMIT = 10;


const handler = nextConnect();

const ApiGetAutocompleteQuerySchema = object({
  q: string().required(),
  location: string().optional(),
  country: string().optional(),
  limit: number().optional(),
});
export type ApiGetAutocompleteQuery = InferType<typeof ApiGetAutocompleteQuerySchema>;
export type ApiGetAutocompleteResponse = {
  results: {
    type: string,
    coordinates: Coordinates,
    distance: number,
    fullText: string,
    mainText: string,
    secondaryText?: string,
    number: string,
    street: string,
    neighborhood: string,
    city: string,
    county: string,
    postalCode: string,
    state: string,
    stateCode: string,
    country: string,
    countryCode: string,
  }[]
}

export async function handleGetAutocomplete(params: ApiGetAutocompleteQuery) {
  const res = await autocompleteApiClient.list({
    query: params.q,
    near: params.location,
    country: params.country,
    limit: params.limit ?? DEFAULT_RESULT_LIMIT,
  });

  const data: ApiGetAutocompleteResponse = {
    results: res.addresses.map(addr => ({
      type: addr.geometry.type,
      coordinates: { lat: addr.latitude, lng: addr.longitude },
      distance: addr.distance,
      mainText: addr.placeLabel || filter([addr.number, addr.street], v => !isEmpty(v)).join(" "),
      secondaryText: addr.placeLabel ? addr.formattedAddress : filter([addr.city, addr.stateCode, addr.countryCode], v => !isEmpty(v)).join(", "),
      fullText: addr.formattedAddress,
      number: addr.number,
      street: addr.street,
      neighborhood: addr.neighborhood,
      city: addr.city,
      county: addr.county,
      postalCode: addr.postalCode,
      state: addr.state,
      stateCode: addr.stateCode,
      country: addr.country,
      countryCode: addr.countryCode,
    }))
  };
  return data;
}

handler.get(
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const query = await ApiGetAutocompleteQuerySchema
      .validate(req.query, { stripUnknown: true })
      .catch(err => {
        if (err instanceof ValidationError) throw new RequestError(`Invalid param: ${err.path}`);
        throw new RequestError("Invalid request");
      });

    const { url } = req;
    const cached = cache.get(url);
    if (cached) return res.status(200).json(cached);

    const data = await handleGetAutocomplete(query);
    cache.put(url, data, CACHE_TIME);

    return res.status(200).json(data);
  }
);

export default handler;
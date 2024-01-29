import { filter, isEmpty } from "lodash";
import cache from "memory-cache";
import { InferType, number, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import radarClient from "@/utils/Radar";

const CACHE_TIME = 5 * 60 * 1000; // 5 mins
const DEFAULT_RESULT_LIMIT = 10;


const handler = nextConnect();

const ApiGetAutocompleteSchema = object({
  query: object({
    q: string().required(),
    location: string().optional(),
    country: string().optional(),
    limit: number().optional(),
  })
});
export type ApiGetAutocompleteQuery = InferType<typeof ApiGetAutocompleteSchema>["query"];
export type ApiGetAutocompleteResponse = {
  results: {
    type: string,
    coordinates: [number, number],
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
  const res = await radarClient.autocomplete({
    query: params.q,
    near: params.location,
    country: params.country,
    limit: params.limit ?? DEFAULT_RESULT_LIMIT,
  });

  const data: ApiGetAutocompleteResponse = {
    results: res.addresses.map(addr => ({
      type: addr.geometry.type,
      coordinates: [addr.latitude, addr.longitude],
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
  authorization({ isSubscriber: true }),
  validation(ApiGetAutocompleteSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetAutocompleteSchema>;

    const { url } = req;
    const cached = cache.get(url);
    if (cached) return res.status(200).json(cached);

    const data = await handleGetAutocomplete(query);
    cache.put(url, data, CACHE_TIME);

    return res.status(200).json(data);
  }
);

export default handler;
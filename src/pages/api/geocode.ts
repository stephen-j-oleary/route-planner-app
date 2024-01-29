import { filter, isEmpty } from "lodash";
import cache from "memory-cache";
import { InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import radarClient from "@/utils/Radar";

const CACHE_TIME = 5 * 60 * 1000; // 5 mins


const handler = nextConnect()

const ApiGetGeocodeSchema = object({
  query: object({
    q: string().required(),
    country: string().optional(),
  }),
})
export type ApiGetGeocodeQuery = InferType<typeof ApiGetGeocodeSchema>["query"]
export type ApiGetGeocodeResponse = {
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

export async function handleGetGeocode(params: ApiGetGeocodeQuery) {
  const res = await radarClient.geocode({
    query: params.q,
    country: params.country,
  });

  const data: ApiGetGeocodeResponse = {
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
    })),
  };

  return data;
}

handler.get(
  authorization({ isSubscriber: true }),
  validation(ApiGetGeocodeSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetGeocodeSchema>;

    const { url } = req;
    const cached = cache.get(url);
    if (cached) return res.status(200).json(cached);

    const data = await handleGetGeocode(query);
    cache.put(url, data, CACHE_TIME);

    return res.status(200).json(data);
  }
)

export default handler
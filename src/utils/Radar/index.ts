import { AutocompleteParams, AutocompleteResponse, DirectionsParams, DirectionsResponse, GeocodeParams, GeocodeResponse, IpGeocodeResponse, MatrixParams, MatrixResponse } from "./types";
import env from "@/utils/env";
import fetchJson from "@/utils/fetchJson";

const RADAR_API = env("LOOP_RADAR_API");
const RADAR_PK = env("LOOP_RADAR_PK");


export type {
  Address,
  AutocompleteParams,
  AutocompleteResponse,
  DirectionsParams,
  DirectionsResponse,
  GeocodeParams,
  GeocodeResponse,
  MatrixParams,
  MatrixResponse,
} from "./types";

class Radar {
  pk: string;
  api: string;

  constructor() {
    if (!RADAR_PK) throw new Error("Radar: Missing private key");
    if (!RADAR_API) throw new Error("Radar: Missing api location");

    this.pk = RADAR_PK;
    this.api = RADAR_API;
  }

  async ipGeocode() {
    return await fetchJson<IpGeocodeResponse>(
      `${this.api}/geocode/ip`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
      },
    );
  }

  async autocomplete(params: AutocompleteParams) {
    return await fetchJson<AutocompleteResponse>(
      `${this.api}/search/autocomplete`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
        query: {
          ...params,
          layers: "fine,postalCode,locality",
        },
      }
    );
  }

  async directions(params: DirectionsParams) {
    const data = await fetchJson<DirectionsResponse>(
      `${this.api}/route/directions`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
        query: {
          ...params,
          units: params.units || "metric",
          mode: "car",
        },
      },
    );

    return data.routes;
  }

  async geocode(params: GeocodeParams) {
    return await fetchJson<GeocodeResponse>(
      `${this.api}/geocode/forward`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
        query: params,
      },
    );
  }

  async matrix(params: MatrixParams) {
    const data = await fetchJson<MatrixResponse>(
      `${this.api}/route/matrix`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
        query: {
          ...params,
          units: params.units || "metric",
          mode: "car",
        },
      },
    );

    return data.matrix;
  }
}


const radarClient = new Radar();

export default radarClient;
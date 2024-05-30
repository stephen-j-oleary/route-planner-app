import { AutocompleteParams, AutocompleteResponse, DirectionsParams, DirectionsResponse, GeocodeParams, GeocodeResponse, MatrixParams, MatrixResponse } from "./types";
import fetchJson from "@/utils/fetchJson";

const RADAR_API = process.env.LOOP_RADAR_API;
const RADAR_PK = process.env.LOOP_RADAR_PK;


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

  async autocomplete(params: AutocompleteParams) {
    const res = await fetchJson(
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
    const data = await res.json();

    if (!res.ok) throw data;

    return data as AutocompleteResponse;
  }

  async directions(params: DirectionsParams) {
    const res = await fetchJson(
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
    const data = await res.json();

    if (!res.ok) throw data;

    return (data as DirectionsResponse).routes;
  }

  async geocode(params: GeocodeParams) {
    const res = await fetchJson(
      `${this.api}/geocode/forward`,
      {
        method: "GET",
        headers: { "Authorization": this.pk },
        query: params,
      },
    );
    const data = await res.json();

    if (!res.ok) throw data;

    return data as GeocodeResponse;
  }

  async matrix(params: MatrixParams) {
    const res = await fetchJson(
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
    const data = await res.json();

    if (!res.ok) throw data;

    return (data as MatrixResponse).matrix;
  }
}


const radarClient = new Radar();

export default radarClient;
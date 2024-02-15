import { AxiosError } from "axios";

import { AutocompleteParams, AutocompleteResponse, DirectionsParams, DirectionsResponse, GeocodeParams, GeocodeResponse, MatrixParams, MatrixResponse } from "./types";
import httpClient from "@/utils/httpClient";

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
    const { data } = await httpClient.request<AutocompleteResponse>({
      method: "get",
      url: `${this.api}/search/autocomplete`,
      headers: { "Authorization": this.pk },
      params: {
        ...params,
        layers: "fine,postalCode,locality",
      },
    });

    return data;
  }

  async directions(params: DirectionsParams) {
    try {
      const { data } = await httpClient.request<DirectionsResponse>({
        method: "get",
        url: `${this.api}/route/directions`,
        headers: { "Authorization": this.pk },
        params: {
          ...params,
          units: params.units || "metric",
          mode: "car",
        },
      });

      return data.routes;
    }
    catch (err: unknown) {
      if (err instanceof AxiosError) throw new Error(err.response?.data.message);
      throw err;
    }
  }

  async geocode(params: GeocodeParams) {
    const { data } = await httpClient.request<GeocodeResponse>({
      method: "get",
      url: `${this.api}/geocode/forward`,
      headers: { "Authorization": this.pk },
      params,
    });

    return data;
  }

  async matrix(params: MatrixParams) {
    const { data } = await httpClient.request<MatrixResponse>({
      method: "get",
      url: `${this.api}/route/matrix`,
      headers: { "Authorization": this.pk },
      params: {
        ...params,
        units: params.units || "metric",
        mode: "car",
      },
    });

    return data.matrix;
  }
}


const radarClient = new Radar();

export default radarClient;
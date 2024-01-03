import JSONCrush from "jsoncrush";
import moment from "moment";
import { v4 as uuid } from "uuid";


export type LocalRouteConstructorProps =
  & Pick<LocalRoute, "userId" | "editUrl" | "stops" | "bounds" | "legs" | "polyline" | "stopOrder">
  & Partial<LocalRoute>

export default class LocalRoute {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  editUrl: string;
  stops: object[];
  stopTime: number;
  bounds: string;
  copyright: string;
  legs: {
    start: string,
    end: string,
    distance: number,
    duration: number,
  }[];
  polyline: string;
  stopOrder: number[];

  static decodeRoute(route: string): Omit<LocalRoute, "_id" | "userId" | "getEncodedRoute"> {
    return JSON.parse(JSONCrush.uncrush(route));
  }

  static encodeRoute(route: Omit<LocalRoute, "_id" | "userId" | "getEncodedRoute">) {
    return JSONCrush.crush(JSON.stringify(route));
  }

  constructor(props: Pick<LocalRoute, "userId" | "editUrl" | "stops" | "bounds" | "legs" | "polyline" | "stopOrder"> & Partial<LocalRoute>) {
    this._id = props._id || uuid();
    this.createdAt = props.createdAt || moment().toISOString();
    this.updatedAt = props.updatedAt || moment().toISOString();
    this.userId = props.userId;
    this.editUrl = props.editUrl;
    this.stops = props.stops;
    this.stopTime = props.stopTime || 0;
    this.bounds = props.bounds;
    this.copyright = props.copyright || "";
    this.legs = props.legs.map(leg => ({
      start: leg.start,
      end: leg.end,
      distance: leg.distance,
      duration: leg.duration,
    })) || [];
    this.polyline = props.polyline;
    this.stopOrder = props.stopOrder;
  }

  static fromEncodedRoute(route: Pick<LocalRoute, "_id" | "userId"> & { route: string }) {
    return new LocalRoute({
      _id: route._id,
      userId: route.userId,
      ...LocalRoute.decodeRoute(route.route),
    });
  }

  getEncodedRoute() {
    return {
      _id: this._id,
      userId: this.userId,
      route: LocalRoute.encodeRoute({
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        editUrl: this.editUrl,
        stops: this.stops,
        stopTime: this.stopTime,
        bounds: this.bounds,
        copyright: this.copyright,
        legs: this.legs,
        polyline: this.polyline,
        stopOrder: this.stopOrder,
      }),
    };
  }
}
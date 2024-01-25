import mongoose from "mongoose";
import { v4 as uuid } from "uuid";


export type Stop = {
  /** The full text of the stop */
  fullText: string,
  /** The coordinates of the stop */
  coordinates: [number, number],
  /** The time stopped in minutes */
  duration: number,
  /** The main text of the stop */
  mainText?: string,
};
export type Leg = {
  /** The leg distance */
  distance: number,
  /** The leg duration in minutes */
  duration: number,
  /** A polyline representing the route taken */
  polyline: string,
};

export type IRoute = {
  /** The route's unique id */
  _id: string;
  /** The owner of the route */
  userId: mongoose.Types.ObjectId;
  /** The url to go to to edit the route */
  editUrl: string;
  /** The route distance */
  distance: number;
  /** The route duration in minutes */
  duration: number;
  /** The stops of the route */
  stops: Stop[];
  /** The legs of the route */
  legs: Leg[];
  /** The timestamp when the route was created */
  createdAt: Date;
  /** The timestamp when the route was last updated */
  updatedAt: Date;
};
export type IRouteConfig =
  & Required<Pick<IRoute, "userId" | "editUrl" | "distance" | "duration" | "stops" | "legs">>
  & Partial<Pick<IRoute, "_id" | "createdAt" | "updatedAt">>;

export type IRouteModel = mongoose.Model<IRoute>;

const routeSchema = new mongoose.Schema<IRoute, IRouteModel>({
  _id: {
    type: String,
    default: uuid,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  editUrl: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  stops: [{
    fullText: {
      type: String,
      required: true,
    },
    mainText: String,
    coordinates: {
      type: [Number],
      required: true,
      default: undefined,
    },
    duration: {
      type: Number,
      default: 0,
    },
  }],
  legs: [{
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    polyline: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
});


const Route = (mongoose.models?.Route as IRouteModel) || mongoose.model("Route", routeSchema);

export default Route;
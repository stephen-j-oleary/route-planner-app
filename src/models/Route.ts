import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

import { DirectionsResponse } from "@/utils/Radar";
import { Matrix } from "@/utils/solveTsp";


export type TStop = {
  /** The full text of the stop */
  fullText: string,
  /** The coordinates of the stop; "lat,lng" */
  coordinates: string,
  /** The time stopped in minutes */
  duration: number,
  /** The main text of the stop */
  mainText?: string,
};

export type TLeg = {
  /** The leg distance */
  distance: { value: number },
  /** The leg duration in minutes */
  duration: { value: number },
  /** The polyline geometry of the leg */
  geometry: { polyline: string },
};


export type TRoute = {
  /** The route's unique id */
  _id: string;
  /** The owner of the route */
  userId: mongoose.Types.ObjectId | string;
  /** The matrix of travel distance and times */
  matrix?: Matrix;
  /** The url to go to to edit the route */
  editUrl?: string;
  /** The stops of the route */
  stops: TStop[];
  /** The legs of the route */
  directions: DirectionsResponse["routes"][number];
  /** The timestamp when the route was created */
  createdAt: Date;
  /** The timestamp when the route was last updated */
  updatedAt: Date;
};

export type TRouteModel = mongoose.Model<TRoute>;

const routeSchema = new mongoose.Schema<TRoute, TRouteModel>({
  _id: {
    type: String,
    default: uuid,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  matrix: {
    type: [[{
      duration: { value: Number },
      distance: { value: Number },
    }]],
  },
  editUrl: {
    type: String,
    required: true,
  },
  stops: [{
    fullText: {
      type: String,
      required: true,
    },
    mainText: String,
    coordinates: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  }],
  directions: {
    type: {
      distance: { value: Number },
      duration: { value: Number },
      legs: [{
        distance: { value: Number },
        duration: { value: Number },
        geometry: { polyline: String },
      }]
    },
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
});


const Route = (mongoose.models?.Route as TRouteModel) || mongoose.model("Route", routeSchema);

export default Route;
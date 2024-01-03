import mongoose from "mongoose";


export interface IRoute {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  editUrl: string;
  stops: object[];
  stopTime: number;
  bounds: object;
  copyright: string;
  legs: {
    start: object,
    end: object,
    distance: object,
    duration: object,
  }[];
  polyline: string;
  stopOrder: number[];
}

export type IRouteModel = mongoose.Model<IRoute>;

const routeSchema = new mongoose.Schema<IRoute, IRouteModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  editUrl: {
    type: String,
    required: true,
  },
  stops: [{
    type: Object,
    required: true,
  }],
  stopTime: {
    type: Number,
    default: 0,
  },
  bounds: {
    type: Object,
    required: true,
  },
  copyright: {
    type: String,
    default: "",
  },
  legs: [{
    start: Object,
    end: Object,
    distance: Object,
    duration: Object,
  }],
  polyline: {
    type: String,
    required: true,
  },
  stopOrder: [{
    type: Number,
    required: true,
  }],
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
});


const Route = (mongoose.models.Route as IRouteModel) || mongoose.model("Route", routeSchema);

export default Route;
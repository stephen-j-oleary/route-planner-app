import { model, models, Schema } from "mongoose";
import { v4 as uuid } from "uuid";


const routeSchema = new Schema({
  _id: {
    type: String,
    default: () => uuid(),
  },
  userId: {
    type: Schema.Types.ObjectId,
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


const Route = models.Route || model("Route", routeSchema);

export default Route;
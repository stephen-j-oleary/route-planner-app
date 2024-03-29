import mongoose from "mongoose";
import { AdapterSession } from "next-auth/adapters";


export interface ISession extends AdapterSession {
  _id: string | mongoose.Types.ObjectId;
  expires: Date;
  sessionToken: string;
  userId: string;
}

export type ISessionModel = mongoose.Model<ISession>;

const sessionSchema = new mongoose.Schema<ISession, ISessionModel>({
  expires: {
    type: Date,
    trim: true,
  },
  sessionToken: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    ref: "User",
  },
});

const Session = (mongoose.models.Session as ISessionModel) || mongoose.model("Session", sessionSchema);

export default Session;
import mongoose from "mongoose";
import { AdapterUser } from "next-auth/adapters";


export const userPublicFields = ["_id"] as const;

export interface IUser extends AdapterUser {
  _id: string | mongoose.Types.ObjectId;
  email: string;
  name?: string | null;
  emailVerified: Date | null;
  image?: string | null;
  customerId?: string;
}

export type IUserModel = mongoose.Model<IUser>;

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  emailVerified: {
    type: Date,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  customerId: {
    type: String,
  },
}, {
  strict: true,
  strictQuery: true,
});


const User = (mongoose.models.User as IUserModel) || mongoose.model("User", userSchema);

export default User;
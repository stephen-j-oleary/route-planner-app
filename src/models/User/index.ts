import mongoose from "mongoose";


export const userPublicFields = ["_id"] as const;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  customerId?: string;
  email: string;
  emailVerified: Date | null;
  name?: string;
  countryCode?: string;
}

export type IUserModel = mongoose.Model<IUser>;

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  customerId: {
    type: String,
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
  name: {
    type: String,
    trim: true,
  },
  countryCode: {
    type: String,
    trim: true,
  },
}, {
  strict: true,
  strictQuery: true,
});


const User = (mongoose.models.User as IUserModel) || mongoose.model("User", userSchema);

export default User;
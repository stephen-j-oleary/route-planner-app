import mongoose from "mongoose";
import { VerificationToken as AdapterVerificationToken } from "next-auth/adapters";


export interface IVerificationToken extends AdapterVerificationToken {
  _id: string | mongoose.Types.ObjectId;
  expires: Date;
  token: string;
  identifier: string;
}

export type IVerificationTokenModel = mongoose.Model<IVerificationToken>;

const verificationTokenSchema = new mongoose.Schema<IVerificationToken, IVerificationTokenModel>({
  expires: {
    type: Date,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  identifier: {
    type: String,
    trim: true,
  },
});

const VerificationToken = (mongoose.models.VerificationToken as IVerificationTokenModel) || mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
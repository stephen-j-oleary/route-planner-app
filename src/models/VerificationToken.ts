import mongoose from "mongoose";


const TOKEN_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TOKEN_LENGTH = 5;

export const verificationTokenPublicFields = ["_id", "createdAt"] as const;

export interface IVerificationToken {
  _id: string | mongoose.Types.ObjectId;
  expires: Date;
  token: string;
  identifier: string;
  createdAt: Date;
}

export type IVerificationTokenModel = mongoose.Model<IVerificationToken>;

const verificationTokenSchema = new mongoose.Schema<IVerificationToken, IVerificationTokenModel>({
  expires: {
    type: Date,
    trim: true,
    default: () => Date.now() + 1000 * 60 * 60 * 3, // 3 hours from now
  },
  token: {
    type: String,
    trim: true,
    default: () => Array(TOKEN_LENGTH)
      .fill(0)
      .map(() => TOKEN_DIGITS[Math.floor(Math.random() * TOKEN_DIGITS.length)])
      .join(""),
  },
  identifier: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const VerificationToken = (mongoose.models.VerificationToken as IVerificationTokenModel) || mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
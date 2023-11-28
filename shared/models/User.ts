import mongoose from "mongoose";


export const userPublicFields = ["_id"] as const;

const userSchema = new mongoose.Schema({
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

export type IUser =
  & mongoose.InferSchemaType<typeof userSchema>
  & { _id: mongoose.Types.ObjectId };


const User = (mongoose.models.User as mongoose.Model<Omit<IUser, "_id">>) || mongoose.model("User", userSchema);

export default User;
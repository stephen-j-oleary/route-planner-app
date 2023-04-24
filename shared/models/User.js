import { model, models, Schema } from "mongoose";


const userSchema = new Schema({
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


const User = models.User || model("User", userSchema);

export default User;
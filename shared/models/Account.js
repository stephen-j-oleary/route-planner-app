import bcrypt from "bcrypt";
import { model, models, Schema } from "mongoose";

const HASH_ITERATIONS = 10;


const accountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    scope: "public",
  },
  provider: {
    type: String,
    trim: true,
    scope: "public",
  },
  providerAccountId: {
    type: String,
    trim: true,
  },
  refresh_token: {
    type: String,
    trim: true,
  },
  access_token: {
    type: String,
    trim: true,
  },
  expires_at: {
    type: Number,
    trim: true,
  },
  token_type: {
    type: String,
    trim: true,
  },
  scope: {
    type: String,
    trim: true,
  },
  id_token: {
    type: String,
    trim: true,
  },
  session_state: {
    type: String,
    trim: true,
  },
  oauth_token_secret: {
    type: String,
    trim: true,
  },
  oauth_token: {
    type: String,
    trim: true,
  },
  credentials: {
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
  },
}, {
  strict: true,
  strictQuery: true,
});

accountSchema.index(
  { userId: 1, provider: 1 },
  { unique: true }
);

accountSchema.pre("save", async function() { // DON'T USE AN ARROW FUNCTION HERE!!!
  if (!this.isModified("credentials.password")) return;

  const _hash = await bcrypt.hash(this.credentials.password, HASH_ITERATIONS);
  if (!_hash) throw new Error("Error generating password");

  this.credentials.password = _hash;
  return;
});

accountSchema.methods.checkCredentials = async function({ email, password }) { // OR HERE!!!
  return (
    email === this.credentials.email
    && bcrypt.compare(password, this.credentials.password)
  );
};


const Account = models.Account || model("Account", accountSchema);

export default Account;
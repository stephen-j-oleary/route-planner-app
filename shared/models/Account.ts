import bcrypt from "bcrypt";
import mongoose from "mongoose";


const HASH_ITERATIONS = 10;


export const accountPublicFields = ["_id", "type", "provider"] as const;

export type Credentials = {
  email: string,
  password: string,
};

export interface IAccount {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  type?: string;
  provider?: string;
  providerAccountId?: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  oauth_token_secret?: string;
  oauth_token?: string;
  credentials?: Credentials;
}

export interface IAccountMethods {
  checkCredentials(params: Credentials): Promise<boolean>;
}

export type IAccountModel = mongoose.Model<IAccount, {}, IAccountMethods>;

const accountSchema = new mongoose.Schema<IAccount, IAccountModel, IAccountMethods>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    trim: true,
  },
  provider: {
    type: String,
    trim: true,
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

accountSchema.pre("save", async function() { // Don't use an arrow function
  if (!this.isModified("credentials.password")) return;

  const _hash = await bcrypt.hash(this.credentials.password, HASH_ITERATIONS);
  if (!_hash) throw new Error("Error generating password");

  this.credentials.password = _hash;
  return;
});

accountSchema.methods.checkCredentials = async function({ email, password }) { // Don't use an arrow function
  return (
    email === this.credentials.email
    && bcrypt.compare(password, this.credentials.password)
  );
};


const Account = (mongoose.models.Account as IAccountModel) || mongoose.model("Account", accountSchema);

export default Account;
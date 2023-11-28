import mongoose from "mongoose";
import { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface User {
    _id: string | mongoose.Types.ObjectId,
  }

  interface Session {
    user: DefaultSession["user"] & {
      _id: string;
      customerId?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
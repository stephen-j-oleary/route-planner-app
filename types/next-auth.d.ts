import { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface User {
    customerId?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      customerId?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
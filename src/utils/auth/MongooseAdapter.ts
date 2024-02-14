import mongoose from "mongoose";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";

import { IAccountModel } from "@/models/Account";
import { ISessionModel } from "@/models/Session";
import { IUserModel } from "@/models/User";
import { IVerificationTokenModel } from "@/models/VerificationToken";
import { fromMongoose, toMongoose } from "@/utils/mongoose";


export interface MongooseAdapterModels {
  User: IUserModel;
  Account: IAccountModel;
  Session: ISessionModel;
  VerificationToken: IVerificationTokenModel;
}

export default function MongooseAdapter(
  dbConnect: Promise<mongoose.Mongoose>,
  models: MongooseAdapterModels,
) {
  const {
    User,
    Account,
    Session,
    VerificationToken,
  } = models;

  // Methods
  const adapterMethods: Adapter = {
    async createUser(data) {
      await dbConnect;
      const user = await User.create(toMongoose<AdapterUser>(data));
      return fromMongoose(user);
    },
    async getUser(id) {
      await dbConnect;
      const user = await User.findById(id);
      if (!user) return null;
      return fromMongoose(user);
    },
    async getUserByEmail(email) {
      await dbConnect;
      const user = await User.findOne({ email });
      if (!user) return null;
      return fromMongoose(user);
    },
    async getUserByAccount(data) {
      await dbConnect;

      // Find account
      const account = await Account.findOne(data);
      if (!account) return null;

      // Find User
      const user = await User.findById(account.userId);
      if (!user) return null;
      return fromMongoose(user);
    },
    async updateUser(data) {
      const { _id, ...user } = toMongoose<AdapterUser>(data);

      await dbConnect;
      const result = await User.findByIdAndUpdate(_id, { $set: user }).exec();
      return fromMongoose(result!);
    },
    async deleteUser(userId) {
      await dbConnect;
      return void await Promise.all([
        Account.deleteMany({ userId }),
        Session.deleteMany({ userId }),
        User.findByIdAndDelete(userId),
      ]);
    },
    async linkAccount(data) {
      await dbConnect;
      const account = await Account.create(toMongoose<AdapterAccount>(data));
      return fromMongoose<AdapterAccount>(account);
    },
    async unlinkAccount(data) {
      await dbConnect;
      const account = await Account.findOneAndDelete(data);
      return fromMongoose<AdapterAccount>(account);
    },
    async createSession(data) {
      await dbConnect;
      const session = await Session.create(toMongoose<AdapterSession>(data));
      return fromMongoose(session);
    },
    async getSessionAndUser(sessionToken) {
      await dbConnect;

      // Get Session
      const session = await Session.findOne({ sessionToken });
      if (!session) return null;

      // Find User
      const user = await User.findById(session.userId);
      if (!user) return null;

      return {
        user: fromMongoose(user),
        session: fromMongoose(session),
      };
    },
    async updateSession(data) {
      const { _id, ...session } = toMongoose<AdapterSession>(data);

      await dbConnect;
      const updatedSession = await Session.findOneAndUpdate(
        { sessionToken: session.sessionToken },
        { $set: session },
      ).lean().exec();
      return fromMongoose(updatedSession!);
    },
    async deleteSession(sessionToken) {
      await dbConnect;
      const session = await Session.findOneAndDelete({ sessionToken });
      return fromMongoose<AdapterSession>(session);
    },
    async createVerificationToken(data) {
      await dbConnect;
      const verificationToken = await VerificationToken.create(toMongoose(data));
      return fromMongoose(verificationToken);
    },
    async useVerificationToken(data) {
      await dbConnect;
      const verificationToken = await VerificationToken.findOneAndDelete(data);
      if (!verificationToken) return null;
      const { id, ...rest } = fromMongoose<AdapterVerificationToken & { id: string }>(verificationToken);
      return rest;
    },
  };

  return adapterMethods;
}
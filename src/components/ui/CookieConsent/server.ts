"use server";

import ConsentRecord, { IConsentRecord } from "@/models/ConsentRecord";
import connectMongoose from "@/utils/connectMongoose";


export async function storeConsentRecord({ _id, ...data }: Omit<IConsentRecord, "createdAt" | "updatedAt">) {
  "use server";

  await connectMongoose();

  await ConsentRecord.findOneAndUpdate({ _id }, data, { upsert: true });
}
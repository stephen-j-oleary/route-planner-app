"use server";

import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

import { CONSENT_RECORD_NAME } from "./constants";
import { getAllCategories, getDefaultCategories, getRequiredCategories } from "./helpers";
import ConsentRecord, { IConsentRecord } from "@/models/ConsentRecord";
import connectMongoose from "@/utils/connectMongoose";


async function getId() {
  return (await handleGetConsentRecord())?._id ?? uuid();
}


export async function handleGetConsentRecord() {
  const record = (await cookies()).get(CONSENT_RECORD_NAME);
  if (!record?.value) return null;
  return JSON.parse(record.value) as Omit<IConsentRecord, "createdAt" | "updatedAt">;
}


export async function allowSelectedCookies(selected: string[]) {
  const _id = await getId();
  const categories = [...new Set([...getDefaultCategories(), ...selected])];
  const consentData = { _id, categories };
  (await cookies()).set({
    name: CONSENT_RECORD_NAME,
    value: JSON.stringify(consentData),
    maxAge: 60 * 60 * 24 * 365,
  });
  await storeConsentRecord(consentData);

  return categories;
}

export async function allowAllCookies() {
  return await allowSelectedCookies(getAllCategories());
}

export async function denyAllCookies() {
  return await allowSelectedCookies(getRequiredCategories());
}


async function storeConsentRecord({ _id, ...data }: Omit<IConsentRecord, "createdAt" | "updatedAt">) {
  await connectMongoose();

  await ConsentRecord.findOneAndUpdate({ _id }, data, { upsert: true });
}
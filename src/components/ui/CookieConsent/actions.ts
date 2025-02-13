import "client-only";

import { CONSENT_RECORD_NAME } from "./constants";
import { getAllCategories, getDefaultCategories, getRequiredCategories } from "./helpers";
import { storeConsentRecord } from "./server";
import { IConsentRecord } from "@/models/ConsentRecord";



function getId() {
  return getConsentRecord()?._id ?? crypto.randomUUID();
}


export function getConsentRecord() {
  const record = localStorage.getItem(CONSENT_RECORD_NAME);
  return record ? (JSON.parse(record) as Omit<IConsentRecord, "createdAt" | "updatedAt">) : undefined;
}

export async function allowSelectedCookies(selected: string[]) {
  const _id = getId();
  const categories = [...new Set([...getDefaultCategories(), ...selected])];
  const consentData = { _id, categories };
  localStorage.setItem(CONSENT_RECORD_NAME, JSON.stringify(consentData));
  await storeConsentRecord(consentData);

  return categories;
}

export async function allowAllCookies() {
  return await allowSelectedCookies(getAllCategories());
}

export async function denyAllCookies() {
  return await allowSelectedCookies(getRequiredCategories());
}
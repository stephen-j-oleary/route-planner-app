import "client-only";

import { IConsentRecord } from "@/models/ConsentRecord";
import pages from "@/pages";
import fetchJson from "@/utils/fetchJson";
import { toAbsolute } from "@/utils/url";


export async function getConsentRecord() {
  return await fetchJson<Omit<IConsentRecord, "createdAt" | "updatedAt">>(
    toAbsolute(pages.api.consent),
    { method: "GET" },
  );
}
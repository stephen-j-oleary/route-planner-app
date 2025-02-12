import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAutocomplete } from "@/app/api/autocomplete/actions";
import NewRoute from "@/components/Routes/New";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import { checkFeature, features } from "@/utils/features";


export default async function NewRoutePage({
  searchParams,
  params,
}: PageProps<{ stops: string[] | undefined }>) {
  if (
    !(await Promise.all([
      checkFeature(features.routes_basic),
      checkFeature(features.routes_premium),
    ])).includes(true)
  ) {
    redirect(pages.plans);
  }

  const { origin, destination, stopTime } = searchParams;
  const { stops = [] } = params;

  const defaultValues = {
    stops: [
      ...(await Promise.all(
        stops.map(async v => {
          const fullText = decodeURIComponent(v);
          return {
            ...(await getAutocomplete({ q: fullText })).results[0],
            fullText,
          }
        })
      )),
      { fullText: "" },
    ],
    origin: +(typeof origin === "string" ? origin : "0"),
    destination: +(typeof destination === "string" ? destination : "0"),
    stopTime: +(typeof stopTime === "string" ? stopTime : "0"),
  };

  const isSaveAllowed = await checkFeature(features.routes_save);


  return (
    <NewRoute
      isSaveAllowed={isSaveAllowed}
      defaultValues={defaultValues}
    />
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Create Route",
  description: "Create an optimized route with Loop Mapping. Enter your destinations and get the most efficient path for your journey, saving time and resources.",
};
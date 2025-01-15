import { cookies } from "next/headers";

import { getAutocomplete } from "@/app/api/autocomplete/actions";
import NewRoute from "@/components/Routes/New";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";
import { hasFeatureAccess, ROUTES_SAVE } from "@/utils/features";


export default async function NewRoutePage({
  searchParams,
  params,
}: PageProps<{ stops: string[] | undefined }>) {
  const { userId } = await auth(cookies());

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

  const isSaveAllowed = await hasFeatureAccess(ROUTES_SAVE, cookies());


  return (
    <NewRoute
      userId={userId}
      isSaveAllowed={isSaveAllowed}
      defaultValues={defaultValues}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - Create Route",
};
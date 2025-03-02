import type { Metadata } from "next";
import { redirect } from "next/navigation";

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

  const isSaveAllowed = await checkFeature(features.routes_save);


  return (
    <NewRoute
      isSaveAllowed={isSaveAllowed}
      params={{
        ...await searchParams,
        ...await params,
      }}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Create Route",
  description: "Create an optimized route with Loop Mapping. Enter your destinations and get the most efficient path for your journey, saving time and resources.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.routes.new}` },
};
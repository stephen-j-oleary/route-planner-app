import type { Metadata } from "next";
import Head from "next/head";
import { cookies, headers } from "next/headers";

import VerifyForm from "@/components/Users/Verify/Form";
import pages from "@/pages";
import { PageProps } from "@/types/next";
import auth from "@/utils/auth";
import { getCallbackUrl } from "@/utils/auth/utils";


export default async function VerifyPage({
  searchParams,
}: PageProps) {
  const callbackUrl = getCallbackUrl({ searchParams, headerStore: headers() });

  const { user } = await auth(cookies()).flow({
    step: pages.verify,
    callbackUrl,
  });

  return (
    <>
      <Head>
        <link rel="canonical" href={pages.verify} />
      </Head>

      <VerifyForm
        email={user!.email!}
        callbackUrl={callbackUrl}
      />
    </>
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Verify Account",
};
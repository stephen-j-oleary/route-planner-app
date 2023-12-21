import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";


export type NextRequest = NextApiRequest | GetServerSidePropsContext["req"];
export type NextResponse = NextApiResponse | GetServerSidePropsContext["res"];
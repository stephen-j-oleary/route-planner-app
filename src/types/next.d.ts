import { NextRequest, NextResponse } from "next/server";

export type Params = Record<string, string | string[] | undefined>;

export type PageProps<TParams extends Params | undefined = undefined> =
  {
    searchParams: Promise<Params>,
    params: Promise<TParams>,
  };

export type AppRouteHandlerContext<TParams extends Params = Params> = {
  params: Promise<TParams>,
};

export type AppRouteHandler<TParams extends Params = Params> =
  (req: NextRequest, context: AppRouteHandlerContext<TParams>) => Promise<NextResponse>;
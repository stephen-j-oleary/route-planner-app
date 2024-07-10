import cache from "memory-cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAutocomplete } from "./actions";
import { ApiGetAutocompleteQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";

const CACHE_TIME = 5 * 60 * 1000; // 5 mins


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const query = await ApiGetAutocompleteQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const { url } = req;
    const cached = cache.get(url);
    if (cached) return NextResponse.json(cached);

    const data = await getAutocomplete(query);
    cache.put(url, data, CACHE_TIME);

    return NextResponse.json(data);
  }
);
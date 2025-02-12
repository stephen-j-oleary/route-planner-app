import { NextResponse } from "next/server";

import { deleteUserRouteById, getUserRouteById, patchUserRouteById } from "./actions";
import { ApiPatchUserRouteByIdBodySchema } from "./schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";
import { checkFeature, features } from "@/utils/features";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(pages.api.userRoutes).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;

    return NextResponse.json(
      await getUserRouteById(id)
    );
  }
);


export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(pages.api.userRoutes).api();
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!(await checkFeature(features.routes_save))) throw new ApiError(403, "Forbidden");

    const { id } = params;

    const body = await ApiPatchUserRouteByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await patchUserRouteById(id, body)
    );
  }
);


export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(pages.api.userRoutes).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;

    await deleteUserRouteById(id);

    return new NextResponse(null, { status: 204 });
  }
);
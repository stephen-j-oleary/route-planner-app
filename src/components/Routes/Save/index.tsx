"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { handleSave } from "./action";
import { IRoute } from "@/models/Route";
import pages from "pages";

const LABEL = "Save route";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: Omit<IRoute, "_id">,
    isCustomer: boolean,
  };

export default function SaveRoute({
  route,
  isCustomer,
  ...props
}: SaveRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [result, action] = React.useActionState(
    () => handleSave({
      ...route,
      editUrl: pathname,
    }),
    null,
  );
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => startTransition(
    () => action()
  );

  React.useEffect(
    () => {
      if (result?.id) router.replace(`${pages.routes.root}/${result.id}`);
    },
    [result]
  );

  return (
    <Tooltip
      title={!isCustomer ? "Subscription required to save routes" : LABEL}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label={LABEL}
          disabled={!isCustomer || isPending}
          onClick={handleClick}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}
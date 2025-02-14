"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { handleSave } from "./action";
import { TRoute } from "@/models/Route";

const LABEL = "Save route";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: Omit<TRoute, "_id">,
    isSaveAllowed: boolean,
  };

export default function SaveRoute({
  route,
  isSaveAllowed,
  ...props
}: SaveRouteProps) {
  const pathname = usePathname();
  const search = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const handleClick = () => startTransition(
    () => handleSave({ ...route, editUrl: `${pathname}?${search.toString()}` })
  );

  return (
    <Tooltip
      title={
        !isSaveAllowed
          ? "Subscription required to save routes"
          : isPending
          ? "Saving route..."
          : LABEL
      }
      enterDelay={500}
    >
      <span>
        <IconButton
          aria-label={LABEL}
          disabled={!isSaveAllowed || isPending}
          onClick={handleClick}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}
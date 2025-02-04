"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { Breadcrumbs, BreadcrumbsProps, Link, Typography } from "@mui/material";

import pages from "@/pages";


function splitPath(path: string) {
  const arr = path
    .split("#")[0]!
    .split("/");
  arr.shift(); // Remove empty item caused by leading slash
  return arr;
}

function parseCrumbName(path: string) {
  return path
    .replace(/\[|\]/g, "") // Remove brackets [] from path items
    .replace(/\./g, "") // Remove dots . from path items
    .replace(/([A-Z])/g, " $1"); // Convert camelCase to Title Case
}


export type NextBreadcrumbsProps =
  & BreadcrumbsProps
  & {
    includeSpread?: boolean,
    paths?: string[],
  };

export default function NextBreadcrumbs({
  includeSpread = false,
  paths,
  ...props
}: NextBreadcrumbsProps) {
  const pathname = usePathname();
  const _paths = paths || splitPath(pathname);

  const crumbNames = _paths.filter(crumb => includeSpread || !crumb.includes("..."));
  const crumbLinks = _paths.slice(0, crumbNames.length);


  return (
    <Breadcrumbs
      maxItems={3}
      itemsAfterCollapse={2}
      aria-label="breadcrumb"
      {...props}
    >
      <Link
        component={NextLink}
        underline="hover"
        color="inherit"
        href={pages.root}
        sx={{ textTransform: "capitalize" }}
      >
        Home
      </Link>

      {
        crumbNames.map((crumbName, i, arr) => (arr.length > i + 1) ? (
          <Link
            key={crumbName}
            component={NextLink}
            underline="hover"
            color="inherit"
            href={"/" + crumbLinks.slice(0, i + 1).join("/")}
            sx={{ textTransform: "capitalize" }}
          >
            {parseCrumbName(crumbName)}
          </Link>
        ) : (
          <Typography
            key={crumbName}
            color="text.primary"
            sx={{ textTransform: "capitalize" }}
          >
            {parseCrumbName(crumbName)}
          </Typography>
        ))
      }
    </Breadcrumbs>
  );
}
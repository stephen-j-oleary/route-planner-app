import NextLink from "next/link";
import { useRouter } from "next/router";

import { Breadcrumbs, Link, Typography } from "@mui/material";


function splitPath(path) {
  const arr = path
    .split("#")[0]
    .split("/");
  arr.shift(); // Remove empty item caused by leading slash
  return arr;
}

function parseCrumbName(path) {
  return path
    .replace(/\[|\]/g, "") // Remove brackets [] from path items
    .replace(/\./g, "") // Remove dots . from path items
    .replace(/([A-Z])/g, " $1"); // Convert camelCase to Title Case
}


export default function NextBreadcrumbs({
  includeSpread = false,
  ...props
}) {
  const { asPath, pathname } = useRouter();
  const crumbNames = splitPath(pathname)
    .filter(crumb => includeSpread || !crumb.includes("..."));
  const crumbLinks = splitPath(asPath)
    .slice(0, crumbNames.length);


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
        href="/"
        sx={{ textTransform: "capitalize" }}
      >
        Home
      </Link>

      {
        crumbNames.map((crumbName, i, arr) => (arr.length > i + 1) ? (
          <Link
            key={crumbLinks[i]}
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
            key={crumbLinks[i]}
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
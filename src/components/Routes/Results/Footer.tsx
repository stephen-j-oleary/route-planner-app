import Link from "next/link";

import { EditRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import SaveRoute from "@/components/Routes/Save";
import { IRoute } from "@/models/Route";


export default function RouteResultsFooter({
  route,
  isSaved,
  isSaveAllowed,
  onEdit,
}: {
  route: (Omit<IRoute, "_id"> & { id?: string }) | undefined | null,
  isSaved: boolean,
  isSaveAllowed: boolean,
  onEdit?: () => void,
}) {
  return (
    <Stack width="100%" direction="row" spacing={1}>
      {
        route && (
          (route.id && isSaved)
            ? (
              <DeleteRoute
                route={route as { id: string }} // Route has an id if this condition passes
                isSaved={isSaved}
              />
            )
            : (
              <SaveRoute
                route={route}
                isSaveAllowed={isSaveAllowed}
              />
            )
        )
      }

      {
        (route?.editUrl || onEdit)
          && (
            <Button
              fullWidth
              size="medium"
              variant="contained"
              startIcon={<EditRounded />}
              {...(route?.editUrl
                ? {
                  component: Link,
                  href: route.editUrl,
                }
                : {
                  onClick: () => onEdit!(),
                }
              )}
            >
              Edit route
            </Button>
          )
      }
    </Stack>
  );
}
import Link from "next/link";

import { EditRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

import { IRoute } from "@/models/Route";


export default function RouteResultsFooter({
  route,
  onEdit,
}: {
  route: Omit<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
}) {
  return (
    <Box>
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
    </Box>
  );
}
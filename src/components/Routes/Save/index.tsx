import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { useCreateUserRoute } from "@/reactQuery/useRoutes";
import { CreateUserRouteData, CreateUserRouteReturn } from "@/services/routes";


export type SaveRouteProps = IconButtonProps & {
  route: CreateUserRouteData,
  onSuccess?: (data: Awaited<CreateUserRouteReturn>) => void,
  onError?: () => void,
  onSettled?: () => void,
}

export default function SaveRoute({
  route,
  onSuccess,
  onError,
  onSettled,
  ...props
}: SaveRouteProps) {
  const handleSaveRoute = useCreateUserRoute();

  return (
    <Tooltip
      title="Save route"
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Save route"
          disabled={handleSaveRoute.isLoading}
          onClick={() => handleSaveRoute.mutate(
            route,
            {
              onSuccess,
              onError,
              onSettled,
            }
          )}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}
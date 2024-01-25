import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { useCreateRoute } from "@/reactQuery/useRoutes";
import { CreateRouteData, CreateRouteReturn } from "@/services/routes";


export type SaveRouteProps = IconButtonProps & {
  route: CreateRouteData,
  onSuccess?: (data: Awaited<CreateRouteReturn>) => void,
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
  const handleSaveRoute = useCreateRoute();

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
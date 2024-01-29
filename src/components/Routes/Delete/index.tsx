import { BookmarkRounded, DeleteRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { IRoute } from "@/models/Route";
import { useDeleteUserRouteById, useGetLocalRouteById } from "@/reactQuery/useRoutes";


export type DeleteRouteProps = IconButtonProps & {
  route: Pick<IRoute, "_id">,
  onSuccess?: () => void,
  onError?: () => void,
  onSettled?: () => void,
}

export default function DeleteRoute({
  route,
  onSuccess,
  onError,
  onSettled,
  ...props
}: DeleteRouteProps) {
  const isSaved = useGetLocalRouteById(route._id, {
    retry: false,
    select: data => !!data,
  });

  const handleDeleteRoute = useDeleteUserRouteById();

  const label = (isSaved.data ? "Unsave" : "Delete") + " route";

  return (
    <Tooltip
      title={label}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label={label}
          disabled={isSaved.isLoading || handleDeleteRoute.isLoading}
          onClick={() => handleDeleteRoute.mutate(
            route._id,
            {
              onSuccess,
              onError,
              onSettled,
            }
          )}
          {...props}
        >
          {
            isSaved.data
              ? <BookmarkRounded />
              : <DeleteRounded />
          }
        </IconButton>
      </span>
    </Tooltip>
  );
}
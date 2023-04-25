import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import { IconButton, Tooltip } from "@mui/material";

import { useDeleteDatabaseRoute } from "@/shared/reactQuery/useDatabaseRoutes";


export default function UnsaveRoute({
  route,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleUnsaveRoute = useDeleteDatabaseRoute();

  return (
    <Tooltip
      title="Unsave route"
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Unsave route"
          disabled={handleUnsaveRoute.isLoading}
          onClick={() => handleUnsaveRoute.mutate(
            route._id,
            {
              onMutate,
              onSuccess,
              onError,
              onSettled,
            }
          )}
          {...props}
        >
          <BookmarkIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}
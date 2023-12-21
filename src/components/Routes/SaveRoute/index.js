import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorderRounded";
import { IconButton, Tooltip } from "@mui/material";

import { useCreateDatabaseRoute } from "@/reactQuery/useDatabaseRoutes";


export default function SaveRoute({
  route,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleSaveRoute = useCreateDatabaseRoute();

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
              onMutate,
              onSuccess,
              onError,
              onSettled,
            }
          )}
          {...props}
        >
          <BookmarkBorderIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}
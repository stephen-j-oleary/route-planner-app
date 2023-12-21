import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Tooltip } from "@mui/material";

import { useDeleteDatabaseRoute } from "@/reactQuery/useDatabaseRoutes";


export default function DeleteRoute({
  route,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleDeleteRoute = useDeleteDatabaseRoute();

  return (
    <Tooltip
      title="Delete route"
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Delete route"
          disabled={handleDeleteRoute.isLoading}
          onClick={() => handleDeleteRoute.mutate(
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
          <DeleteIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}
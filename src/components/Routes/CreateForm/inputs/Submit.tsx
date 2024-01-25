import { RouteRounded } from "@mui/icons-material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";


export default function CreateRouteFormSubmit(props: LoadingButtonProps) {
  return (
    <LoadingButton
      fullWidth
      type="submit"
      size="large"
      variant="contained"
      startIcon={<RouteRounded />}
      loadingPosition="start"
      {...props}
    >
      Calculate route
    </LoadingButton>
  );
}
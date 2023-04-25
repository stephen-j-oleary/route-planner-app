import RouteIcon from "@mui/icons-material/RouteRounded";
import { LoadingButton } from "@mui/lab";


export default function CreateRouteFormSubmit(props) {
  return (
    <LoadingButton
      fullWidth
      type="submit"
      size="large"
      variant="contained"
      startIcon={<RouteIcon />}
      loadingPosition="start"
      {...props}
    >
      Calculate route
    </LoadingButton>
  );
}
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import { LoadingButton } from "@mui/lab";
import { Tooltip } from "@mui/material";


export default function SubscriptionFormSubmit({
  tooltipText,
  submitText,
  ...props
}) {
  return (
    <Tooltip title={tooltipText}>
      <span style={{ width: "100%" }}>
        <LoadingButton
          fullWidth
          variant="contained"
          size="large"
          loadingPosition="end"
          endIcon={<ArrowForwardIcon />}
          {...props}
        >
          {submitText}
        </LoadingButton>
      </span>
    </Tooltip>
  );
}
import { Alert, AlertProps as MuiAlertProps, Slide, Snackbar, SnackbarProps } from "@mui/material";


export type ToastProps =
  & Omit<SnackbarProps, "TransitionComponent">
  & {
    severity?: MuiAlertProps["severity"],
    AlertProps?: MuiAlertProps,
  };

export default function Toast({
  children,
  onClose,
  severity = "success",
  AlertProps = {},
  ...props
}: ToastProps) {
  return (
    <Snackbar
      onClose={onClose}
      TransitionComponent={params => <Slide {...params} direction="right" />}
      {...props}
    >
      <Alert
        severity={severity}
        onClose={onClose && (e => onClose(e, "clickaway"))}
        sx={{ width: "100%" }}
        {...AlertProps}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}
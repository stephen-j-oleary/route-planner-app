import { CircularProgress, Typography } from "@mui/material";


export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        component="p"
        variant="h2"
        color="inherit"
        sx={{ pb: 5 }}
      >
        Loop Mapping
      </Typography>

      <CircularProgress />
    </div>
  );
}
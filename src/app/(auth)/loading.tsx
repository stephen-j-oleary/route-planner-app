import { CircularProgress, Stack } from "@mui/material";


export default function Loading() {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      py={4}
    >
      <CircularProgress />
    </Stack>
  );
}

import Map from "../components/Map";
import Route from "../components/Route";
import { Stack } from "@mui/material";

export default function App() {
  return (
    <Stack
      direction={{ xs: "column", md: "row-reverse" }}
      overflow="hidden"
      position="absolute"
      sx={{ inset: 0 }}
    >
      <Map />
      <Route />
    </Stack>
  );
}

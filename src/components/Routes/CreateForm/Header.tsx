import { Typography } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";


export default function RoutesFormHeader() {
  return (
    <RoutesHeader>
      <Typography
        component="h1"
        variant="h3"
      >
        Create a route
      </Typography>
    </RoutesHeader>
  );
}
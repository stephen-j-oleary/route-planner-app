import { Typography } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";
import ListSkeleton from "@/components/ui/ListSkeleton";


export default function Loading() {
  return (
    <div>
      <RoutesHeader>
        <Typography
          component="h1"
          variant="h3"
        >
          Create a route
        </Typography>
      </RoutesHeader>

      <ListSkeleton />
    </div>
  );
}
import moment from "moment";

import { List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText } from "@mui/material";

import ListSkeleton from "@/components/ui/ListSkeleton";
import NextLinkComposed from "@/components/ui/NextLinkComposed";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";


export default function RoutesList({
  loading,
  error,
  data,
  visible,
  actions = () => null,
  ...props
}) {
  const { IncrementButton, ...loadMore } = useLoadMore(data, visible);


  if (loading) {
    return (
      <ListSkeleton
        disablePadding
        rowProps={{ divider: true }}
      />
    );
  }

  if (error) {
    return (
      <ViewError
        primary="Routes could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <ViewError
        primary="No routes found"
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        loadMore.visible.map(route => {
          const { _id, stops, createdAt } = route;
          const routeLength = stops.length;

          return (
            <ListItem
              key={_id}
              disablePadding
              dense
              divider
            >
              <ListItemButton
                dense
                component={NextLinkComposed}
                to={{
                  pathname: "/routes/[_id]",
                  query: { _id },
                }}
              >
                <ListItemText
                  primary={`${routeLength} Stop${routeLength > 1 ? "s" : ""} created ${moment(createdAt).calendar(null, { lastWeek: "dddd [at] LT", sameElse: "ll [at] LT" })}`}
                  secondary={stops.map(v => v.value).join(" | ")}
                  secondaryTypographyProps={{
                    sx: theme => theme.typography.limitLines(1)
                  }}
                />
              </ListItemButton>

              <ListItemSecondaryAction>
                {actions(route)}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      }

      <ListItem dense disablePadding>
        <IncrementButton
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
        />
      </ListItem>
    </List>
  );
}
import moment from "moment";
import React from "react";
import { UseQueryResult } from "react-query";

import { Button, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListProps } from "@mui/material";

import ListSkeleton from "@/components/ui/ListSkeleton";
import NextLinkComposed from "@/components/ui/NextLinkComposed";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import { IRoute } from "@/models/Route";


export type RoutesListProps = ListProps & {
  routesQuery: UseQueryResult<IRoute[]>,
  visible?: number,
  actions?: (route: IRoute) => React.ReactNode,
}

export default function RoutesList({
  routesQuery,
  visible,
  actions = () => null,
  ...props
}: RoutesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(routesQuery.data, visible);


  if (routesQuery.isIdle || routesQuery.isLoading) {
    return (
      <ListSkeleton
        disablePadding
        rowProps={{ divider: true }}
      />
    );
  }

  if (routesQuery.isError) {
    return (
      <ViewError
        primary="Routes could not be loaded"
        secondary="An error occurred"
      />
    );
  }

  if (!routesQuery.data || routesQuery.data.length === 0) {
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
                  secondary={stops.map(v => v.fullText).join(" | ")}
                  secondaryTypographyProps={{
                    sx: theme => theme.limitLines(1)
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
        <Button
          fullWidth
          sx={{ fontSize: "caption.fontSize" }}
          {...incrementButtonProps}
        />
      </ListItem>
    </List>
  );
}
"use client";

import moment from "moment";
import pluralize from "pluralize";

import { Button, List, ListItem, ListItemButton, ListItemText, ListProps } from "@mui/material";

import DeleteRoute from "./Delete";
import NextLinkComposed from "@/components/ui/NextLinkComposed";
import ViewError from "@/components/ui/ViewError";
import useLoadMore from "@/hooks/useLoadMore";
import { IRoute } from "@/models/Route";
import pages from "@/pages";


export type RoutesListProps = ListProps & {
  routes: (Omit<IRoute, "_id"> & { id: string })[],
  visible?: number,
}

export default function RoutesList({
  routes,
  visible = 10,
  ...props
}: RoutesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(routes, visible, { increment: 10 });

  if (!routes?.length) {
    return (
      <ViewError
        primary="No routes found"
        secondary="Looks like you haven't saved any routes yet"
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        loadMore.visible.map(route => {
          const { id, stops, createdAt } = route;
          const routeLength = stops.length;

          return (
            <ListItem
              key={id}
              disablePadding
              dense
              divider
              secondaryAction={
                <DeleteRoute
                  route={route}
                  isSaved={true}
                />
              }
            >
              <ListItemButton
                dense
                component={NextLinkComposed}
                to={`${pages.routes.id}${id}`}
              >
                <ListItemText
                  primary={`${routeLength} ${pluralize("Stop", routeLength)} created ${moment(createdAt).calendar(null, { lastWeek: "dddd [at] LT", sameElse: "ll [at] LT" })}`}
                  secondary={stops.map(v => v.fullText).join(" | ")}
                  slotProps={{
                    secondary: {
                      sx: theme => theme.limitLines(1),
                    },
                  }}
                />
              </ListItemButton>
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
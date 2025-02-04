"use client";

import moment from "moment";
import Link from "next/link";
import pluralize from "pluralize";

import { RouteRounded } from "@mui/icons-material";
import { Button, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListProps, Stack } from "@mui/material";

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
  visible,
  ...props
}: RoutesListProps) {
  const { incrementButtonProps, ...loadMore } = useLoadMore(routes, visible);

  if (!routes?.length) {
    return (
      <ViewError
        primary="No routes found"
        secondary="Looks like you haven't created any routes recently"
        action={
          <Stack alignItems="center">
            <Button
              variant="text"
              size="medium"
              component={Link}
              href={pages.routes.new}
              startIcon={<RouteRounded />}
            >
              Create a route now
            </Button>
          </Stack>
        }
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
            >
              <ListItemButton
                dense
                component={NextLinkComposed}
                to={`${pages.routes.root}/${id}`}
              >
                <ListItemText
                  primary={`${routeLength} ${pluralize("Stop", routeLength)} created ${moment(createdAt).calendar(null, { lastWeek: "dddd [at] LT", sameElse: "ll [at] LT" })}`}
                  secondary={stops.map(v => v.fullText).join(" | ")}
                  secondaryTypographyProps={{
                    sx: theme => theme.limitLines(1)
                  }}
                />
              </ListItemButton>

              <ListItemSecondaryAction>
                <DeleteRoute
                  route={route}
                  isSaved={true}
                />
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
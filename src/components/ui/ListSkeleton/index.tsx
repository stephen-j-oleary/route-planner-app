import { ReactNode } from "react";

import { List, ListItem, ListItemProps, ListItemText, ListItemTextProps, ListProps, Skeleton } from "@mui/material";


export type ListSkeletonProps =
  & ListProps
  & {
    rows?: number,
    cols?: number,
    rowProps?: ListItemProps,
    colProps?: ListItemTextProps,
    disableSecondary?: boolean,
    renderPrimary?: () => ReactNode,
    renderSecondary?: () => ReactNode,
    renderCol?: (index: string | number) => ReactNode,
  };

export default function ListSkeleton({
  rows = 3,
  cols = 1,
  rowProps = {},
  colProps = {},
  disableSecondary = false,
  renderPrimary = () => <Skeleton />,
  renderSecondary = () => <Skeleton />,
  renderCol = index => (
    <ListItemText
      key={index}
      primary={renderPrimary()}
      primaryTypographyProps={{ sx: { margin: 0 } }}
      {...(!disableSecondary
        ? { secondary: renderSecondary() }
        : {}
      )}
      {...colProps}
    />
  ),
  ...props
}: ListSkeletonProps) {
  return (
    <List {...props}>
      {
        new Array(rows).fill(0).map((_item, i) => (
          <ListItem key={i} {...rowProps}>
            {
              new Array(cols).fill(0).map((_item, j) => renderCol(j))
            }
          </ListItem>
        ))
      }
    </List>
  );
}
import React from "react";

import { Skeleton, Table, TableBody, TableCell, TableCellProps, TableProps, TableRow, TableRowProps, Typography } from "@mui/material";


export type TableSkeletonProps =
  & TableProps
  & {
    rows?: number,
    cols?: number,
    rowProps?: TableRowProps,
    colProps?: TableCellProps,
    disableSecondary?: boolean,
    renderPrimary?: () => React.ReactNode,
    renderSecondary?: () => React.ReactNode,
    renderCol?: (index: string | number) => React.ReactNode,
  }

export default function TableSkeleton({
  rows = 3,
  cols = 1,
  rowProps = {},
  colProps = {},
  disableSecondary = false,
  renderPrimary = () => <Skeleton />,
  renderSecondary = () => <Skeleton />,
  renderCol = index => (
    <TableCell key={index} {...colProps}>
      <Typography variant="body1">
        {renderPrimary()}
      </Typography>
      {
        !disableSecondary &&
          <Typography variant="body2">
            {renderSecondary()}
          </Typography>
      }
    </TableCell>
  ),
  ...props
}: TableSkeletonProps) {
  return (
    <Table {...props}>
      <TableBody>
        {
          new Array(rows).fill(0).map((_item, i) => (
            <TableRow key={i} {...rowProps}>
              {
                new Array(cols).fill(0).map((_item, j) => renderCol(j))
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}
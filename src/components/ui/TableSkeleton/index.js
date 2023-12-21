import { Skeleton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";


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
      <Typography variant="primary">
        {renderPrimary()}
      </Typography>
      {
        !disableSecondary &&
          <Typography variant="secondary">
            {renderSecondary()}
          </Typography>
      }
    </TableCell>
  ),
  ...props
}) {
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
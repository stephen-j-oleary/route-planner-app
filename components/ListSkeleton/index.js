import { List, ListItem, ListItemText, Skeleton } from "@mui/material";


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
}) {
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
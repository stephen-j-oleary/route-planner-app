import { List, ListItem, ListItemText, ListProps } from "@mui/material";

import ViewError from "@/components/ui/ViewError";
import { IAccount } from "@/models/Account";
import { FromMongoose } from "@/utils/mongoose";


export type AccountsListProps =
  & ListProps
  & { accounts: FromMongoose<IAccount[]> };

export default function AccountsList({
  accounts,
  ...props
}: AccountsListProps) {
  if (!accounts.length) {
    return (
      <ViewError
        primary="No accounts"
        secondary="We couldn't find any accounts. Please try again"
      />
    );
  }

  return (
    <List disablePadding {...props}>
      {
        accounts.map(item => (
          <ListItem
            key={item.id}
            divider
          >
            <ListItemText
              primary={item.provider}
              primaryTypographyProps={{ textTransform: "capitalize" }}
            />
          </ListItem>
        ))
      }
    </List>
  );
}
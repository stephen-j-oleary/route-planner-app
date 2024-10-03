import { List, ListItem, ListItemText, ListProps } from "@mui/material";

import AccountActions from "@/components/Accounts/Actions";
import ViewError from "@/components/ui/ViewError";
import { IAccount } from "@/models/Account";
import { fromMongoose } from "@/utils/mongoose";


export type AccountsListProps =
  & ListProps
  & { accounts: IAccount[] };

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
            key={item._id.toString()}
            divider
          >
            <ListItemText
              primary={item.provider}
              primaryTypographyProps={{ textTransform: "capitalize" }}
            />

            <AccountActions
              account={fromMongoose(item)!}
              allowRemove={accounts.length > 1}
            />
          </ListItem>
        ))
      }
    </List>
  );
}
import { capitalize } from "lodash";

import { List, ListItem, ListItemText, ListProps } from "@mui/material";

import AccountActions from "@/components/Accounts/Actions";
import ViewError from "@/components/ui/ViewError";
import { IAccount } from "@/models/Account";


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
              primary={capitalize(item.provider)}
            />

            <AccountActions
              account={item}
              allowRemove={accounts.length > 1}
            />
          </ListItem>
        ))
      }
    </List>
  );
}
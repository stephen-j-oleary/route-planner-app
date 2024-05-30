import { capitalize } from "lodash";

import { List, ListItem, ListItemText, ListProps } from "@mui/material";

import AccountActions from "@/components/Accounts/Actions";
import { IAccount } from "@/models/Account";


export type AccountsListProps =
  & ListProps
  & { accounts: IAccount[] };

export default function AccountsList({
  accounts,
  ...props
}: AccountsListProps) {
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
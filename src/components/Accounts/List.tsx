import { capitalize } from "lodash";
import { UseQueryResult } from "react-query"

import { Button, List, ListItem, ListItemText, ListProps } from "@mui/material";

import AccountActions from "@/components/Accounts/Actions";
import AddAccount from "@/components/Accounts/Actions/Add";
import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";
import { IAccount } from "@/models/Account";
import { useGetProviders } from "@/reactQuery/useProviders";


export type AccountsListProps = ListProps & {
  accountsQuery: UseQueryResult<IAccount[]>,
};

export default function AccountsList({
  accountsQuery,
  ...props
}: AccountsListProps) {
  const availableProviders = useGetProviders({
    select: data => (data ? Object.values(data) : []).filter(prov => !accountsQuery.data?.some(acc => acc.provider === prov.id)),
  });

  if (accountsQuery.isIdle || accountsQuery.isLoading) return <ListSkeleton />;
  if (accountsQuery.isError) return <ViewError />;

  return (
    <List disablePadding {...props}>
      {
        accountsQuery.data.map(item => (
          <ListItem
            key={item._id.toString()}
            divider
          >
            <ListItemText
              primary={capitalize(item.provider)}
            />

            <AccountActions
              account={item}
              allowRemove={accountsQuery.data.length > 1}
            />
          </ListItem>
        ))
      }

      <AddAccount
        providersQuery={availableProviders}
        renderTrigger={({ disabled, ...props }) => (
          <ListItem disablePadding>
            <Button
              fullWidth
              disabled={disabled || !availableProviders.data?.length}
              {...props}
            >
              Add sign in method...
            </Button>
          </ListItem>
        )}
      />
    </List>
  );
}
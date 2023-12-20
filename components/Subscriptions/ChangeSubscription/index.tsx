import Link from "next/link";

import { MenuItem, MenuItemProps } from "@mui/material";


export type ChangeSubscriptionProps = MenuItemProps;

export default function ChangeSubscription(props: ChangeSubscriptionProps) {
  return (
    <MenuItem
      dense
      component={Link}
      href="/plans"
      {...props}
    >
      Change subscription
    </MenuItem>
  );
}
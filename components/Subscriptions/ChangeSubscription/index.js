import Link from "next/link";

import { MenuItem } from "@mui/material";


export default function ChangeSubscription(props) {
  return (
    <MenuItem
      dense
      component={Link}
      href="/account/subscriptions/manage"
      {...props}
    >
      Change subscription
    </MenuItem>
  );
}